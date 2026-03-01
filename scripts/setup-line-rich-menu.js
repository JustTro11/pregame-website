#!/usr/bin/env node
/**
 * LINE Rich Menu Setup Script
 * 
 * Usage: node scripts/setup-line-rich-menu.js
 * 
 * Requires:
 *   - LINE_CHANNEL_ACCESS_TOKEN environment variable
 *   - Rich menu image at scripts/rich-menu.png (2500x1686 or 2500x843)
 */

const fs = require('fs');
const path = require('path');

const LINE_API_BASE = 'https://api.line.me/v2/bot';
const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

if (!TOKEN) {
    console.error('❌ LINE_CHANNEL_ACCESS_TOKEN environment variable is required');
    process.exit(1);
}

// Rich menu configuration - 4 buttons in 2x2 grid
const richMenuConfig = {
    size: {
        width: 2500,
        height: 1686
    },
    selected: true,
    name: "PreGame Main Menu",
    chatBarText: "選單 Menu",
    areas: [
        {
            // Top-left: 預約訂位 (Book)
            bounds: { x: 0, y: 0, width: 1250, height: 843 },
            action: { type: "message", text: "預約" }
        },
        {
            // Top-right: 營業時間 (Hours)
            bounds: { x: 1250, y: 0, width: 1250, height: 843 },
            action: { type: "message", text: "營業時間" }
        },
        {
            // Bottom-left: 地址 (Location)
            bounds: { x: 0, y: 843, width: 1250, height: 843 },
            action: { type: "message", text: "地址" }
        },
        {
            // Bottom-right: 菜單 (Menu)
            bounds: { x: 1250, y: 843, width: 1250, height: 843 },
            action: { type: "uri", uri: "https://pregame.tw/menu" }
        }
    ]
};

async function createRichMenu() {
    console.log('📋 Creating rich menu...');

    const response = await fetch(`${LINE_API_BASE}/richmenu`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify(richMenuConfig)
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create rich menu: ${response.status} ${error}`);
    }

    const data = await response.json();
    console.log(`✅ Rich menu created: ${data.richMenuId}`);
    return data.richMenuId;
}

async function uploadRichMenuImage(richMenuId, imagePath) {
    console.log(`🖼️  Uploading image for ${richMenuId}...`);

    const imageBuffer = fs.readFileSync(imagePath);

    // Detect content type from file extension
    const contentType = imagePath.endsWith('.jpg') || imagePath.endsWith('.jpeg')
        ? 'image/jpeg'
        : 'image/png';

    // Note: Image upload uses api-data.line.me, not api.line.me
    const response = await fetch(`https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`, {
        method: 'POST',
        headers: {
            'Content-Type': contentType,
            'Authorization': `Bearer ${TOKEN}`
        },
        body: imageBuffer
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to upload image: ${response.status} ${error}`);
    }

    console.log('✅ Image uploaded');
}

async function setDefaultRichMenu(richMenuId) {
    console.log(`🎯 Setting ${richMenuId} as default...`);

    const response = await fetch(`${LINE_API_BASE}/user/all/richmenu/${richMenuId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${TOKEN}`
        }
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to set default: ${response.status} ${error}`);
    }

    console.log('✅ Rich menu set as default for all users');
}

async function listRichMenus() {
    const response = await fetch(`${LINE_API_BASE}/richmenu/list`, {
        headers: { 'Authorization': `Bearer ${TOKEN}` }
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.richmenus || [];
}

async function deleteRichMenu(richMenuId) {
    await fetch(`${LINE_API_BASE}/richmenu/${richMenuId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${TOKEN}` }
    });
}

async function main() {
    try {
        // Check for image
        let imagePath = path.join(__dirname, 'rich-menu.jpg');
        if (!fs.existsSync(imagePath)) {
            imagePath = path.join(__dirname, 'rich-menu.png');
        }
        if (!fs.existsSync(imagePath)) {
            console.error(`❌ Image not found: ${imagePath}`);
            console.log('Please place your rich menu image at scripts/rich-menu.jpg or .png');
            process.exit(1);
        }

        // List existing menus
        const existingMenus = await listRichMenus();
        if (existingMenus.length > 0) {
            console.log(`Found ${existingMenus.length} existing rich menu(s)`);
            for (const menu of existingMenus) {
                console.log(`  - ${menu.richMenuId}: ${menu.name}`);
            }
        }

        // Create new menu
        const richMenuId = await createRichMenu();

        // Upload image
        await uploadRichMenuImage(richMenuId, imagePath);

        // Set as default
        await setDefaultRichMenu(richMenuId);

        console.log('\n🎉 Rich menu setup complete!');
        console.log(`Rich Menu ID: ${richMenuId}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
