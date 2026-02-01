
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const BUCKET_NAME = 'static-assets';

const filesToUpload = [
    { local: 'public/assets/instagram/2026-01-05_12-00-18_UTC.jpg', remote: 'hero.jpg' },
    // Dalgona Coffee (replacing Irish Coffee)
    { local: 'public/assets/instagram/2025-05-27_03-40-52_UTC.jpg', remote: 'drink-1.jpg' },
    // Soda Float
    { local: 'public/assets/instagram/2025-05-25_10-27-51_UTC.jpg', remote: 'drink-2.jpg' },
    // Irish Coffee (replacing Craft Mocktail slot)
    { local: 'public/assets/instagram/2025-05-19_14-28-52_UTC.jpg', remote: 'drink-3.jpg' },
    { local: 'public/assets/branding/logo.jpg', remote: 'logo.jpg' },
    // Lookbook images (using some from the previous list as examples)
    { local: 'public/assets/instagram/2026-01-23_08-58-31_UTC_1.jpg', remote: 'lookbook-1.jpg' },
    { local: 'public/assets/instagram/2026-01-06_07-19-31_UTC_1.jpg', remote: 'lookbook-2.jpg' },
    { local: 'public/assets/instagram/2024-11-18_11-30-38_UTC_3.jpg', remote: 'lookbook-3.jpg' },
    { local: 'public/assets/instagram/2026-01-05_12-00-18_UTC.jpg', remote: 'lookbook-4.jpg' },
    { local: 'public/assets/instagram/2026-01-03_11-39-31_UTC.jpg', remote: 'lookbook-5.jpg' },
    { local: 'public/assets/instagram/2025-06-18_04-07-01_UTC_5.jpg', remote: 'lookbook-6.jpg' },
    { local: 'public/assets/instagram/2026-01-12_07-24-47_UTC.jpg', remote: 'lookbook-7.jpg' },
    { local: 'public/assets/instagram/2026-01-11_10-00-43_UTC.jpg', remote: 'lookbook-8.jpg' },
];

async function uploadFile(localPath: string, remotePath: string) {
    try {
        if (!fs.existsSync(localPath)) {
            console.warn(`File not found: ${localPath}`);
            return;
        }
        const fileBuffer = fs.readFileSync(localPath);
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(remotePath, fileBuffer, {
                contentType: 'image/jpeg',
                upsert: true,
            });

        if (error) {
            console.error(`Error uploading ${localPath}:`, error.message);
        } else {
            console.log(`Uploaded ${localPath} to ${remotePath}`);
        }
    } catch (err) {
        console.error(`Unexpected error with ${localPath}:`, err);
    }
}

async function main() {
    console.log('Starting upload...');
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, { public: true }).catch(() => ({ error: null })); // Ignored if exists

    // Check if bucket exists/accessible
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
        console.error("Error listing buckets:", listError);
        return;
    }

    if (!buckets.find(b => b.name === BUCKET_NAME)) {
        console.log(`Bucket ${BUCKET_NAME} not found, attempting to create...`);
        const { data, error: createError } = await supabase.storage.createBucket(BUCKET_NAME, { public: true });
        if (createError) console.error("Error creating bucket:", createError);
        else console.log("Bucket created.");
    }

    for (const file of filesToUpload) {
        await uploadFile(file.local, file.remote);
    }
    console.log('Upload complete.');
}

main();
