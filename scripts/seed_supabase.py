import os
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Load env vars
load_dotenv(os.path.join(os.path.dirname(__file__), '../.env.local'))

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing Supabase environment variables.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

IMAGES = [
    '2026-01-23_08-58-31_UTC_1.jpg',
    '2026-01-06_07-19-31_UTC_1.jpg',
    '2024-11-18_11-30-38_UTC_3.jpg',
    '2026-01-05_12-00-18_UTC.jpg',
    '2026-01-03_11-39-31_UTC.jpg',
    '2025-06-18_04-07-01_UTC_5.jpg',
    '2026-01-12_07-24-47_UTC.jpg',
    '2026-01-11_10-00-43_UTC.jpg',
]

LOCAL_DIR = os.path.join(os.path.dirname(__file__), '../public/assets/instagram/')

def seed():
    print("🚀 Seeding Supabase with local assets...")
    
    for i, filename in enumerate(IMAGES):
        file_path = os.path.join(LOCAL_DIR, filename)
        if not os.path.exists(file_path):
            print(f"⚠️ Warning: File not found: {file_path}")
            continue
            
        shortcode = filename.split('_UTC')[0].replace('-', '').replace('_', '') + str(i)
        storage_path = f"posts/{filename}"
        
        print(f"Uploading {filename}...")
        
        with open(file_path, 'rb') as f:
            file_data = f.read()
            
        try:
            # Upload 
            supabase.storage.from_("instagram-assets").upload(
                path=storage_path,
                file=file_data,
                file_options={"content-type": "image/jpeg", "upsert": "true"}
            )
            
            public_url = supabase.storage.from_("instagram-assets").get_public_url(storage_path)
            
            # Insert into DB
            supabase.table("instagram_posts").upsert({
                "shortcode": shortcode,
                "media_url": public_url,
                "instagram_url": "https://instagram.com/pregame.tw",
                "caption": "Bootstrap Archive",
                "created_at": (datetime.now() - timedelta(days=i)).isoformat(),
                "is_featured": False
            }).execute()
            
            print(f"✅ Successfully seeded {filename}")
            
        except Exception as e:
            print(f"❌ Error seeding {filename}: {e}")

if __name__ == "__main__":
    seed()
