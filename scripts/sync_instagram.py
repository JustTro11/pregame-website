import os
import instaloader
import requests
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime

# Load env vars
load_dotenv(os.path.join(os.path.dirname(__file__), '../.env.local'))

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
# IMPORTANT: Need Service Role Key for writes from script
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL:
    print("Error: Missing NEXT_PUBLIC_SUPABASE_URL environment variable.")
if not SUPABASE_KEY:
    print("Error: Missing SUPABASE_SERVICE_ROLE_KEY environment variable.")

if not SUPABASE_URL or not SUPABASE_KEY:
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
loader = instaloader.Instaloader(
    download_pictures=True,
    download_videos=False,
    download_comments=False,
    save_metadata=False,
    compress_json=False
)

def sync_instagram():
    profile_name = "pregame.tw"
    print(f"Syncing Instagram for @{profile_name}...")

    try:
        profile = instaloader.Profile.from_username(loader.context, profile_name)
    except Exception as e:
        print(f"Error fetching profile: {e}")
        return

    # Fetch last 12 posts
    posts = []
    count = 0
    for post in profile.get_posts():
        if count >= 12:
            break
        
        # We only want images for now
        if not post.is_video:
            posts.append(post)
            count += 1

    for post in posts:
        # Check if already in DB
        res = supabase.table("instagram_posts").select("shortcode").eq("shortcode", post.shortcode).execute()
        if res.data:
            print(f"Post {post.shortcode} already exists, skipping.")
            continue

        print(f"Processing new post: {post.shortcode}...")

        # Download image
        image_url = post.url
        img_data = requests.get(image_url).content
        
        # Upload to Supabase Storage
        file_name = f"{post.shortcode}.jpg"
        file_path = f"posts/{file_name}"
        
        try:
            # Upload file
            supabase.storage.from_("instagram-assets").upload(
                path=file_path,
                file=img_data,
                file_options={"content-type": "image/jpeg"}
            )
            
            # Get public URL
            public_url = supabase.storage.from_("instagram-assets").get_public_url(file_path)
            
            # Insert into DB
            supabase.table("instagram_posts").insert({
                "shortcode": post.shortcode,
                "media_url": public_url,
                "instagram_url": f"https://instagram.com/p/{post.shortcode}/",
                "caption": post.caption or "",
                "created_at": post.date_utc.isoformat(),
                "is_featured": False
            }).execute()
            
            print(f"Successfully synced {post.shortcode}")
        except Exception as e:
            print(f"Error syncing {post.shortcode}: {e}")

if __name__ == "__main__":
    sync_instagram()
