# Installation Instructions

## Load the Extension in Chrome

1. Open **Chrome** and navigate to `chrome://extensions/`
2. Toggle **Developer mode** ON (top right corner)
3. Click **Load unpacked**
4. Select this folder: `/Users/mbp16-oo/Library/CloudStorage/GoogleDrive-oliveroliverio@gmail.com/My Drive/_VIP/TL-chrom-ext_KD-YT-helper`
5. The extension should now appear in your extensions list

## Configure Options (Optional)

1. Click the **Details** button on the extension card
2. Click **Extension options** 
3. Adjust step sizes and modifier keys as needed
4. Click **Save**

## Usage

- Navigate to any page with HTML5 video (YouTube, Vimeo, etc.)
- Click on the video to make it active
- Use **Left/Right** arrow keys for ±1.0s jumps
- Use **Alt + Left/Right** for ±0.5s fine jumps
- Hold keys to repeat small nudges

## File URLs (Optional)

If you want to use this on local video files (`file://` URLs):
1. Go to `chrome://extensions/`
2. Find "Dance Skip Keys" extension
3. Click **Details**
4. Enable **Allow access to file URLs**

## Troubleshooting

- **No effect?** Make sure there's an actual `<video>` element on the page
- **Conflicts?** The extension uses capture phase to prevent double-seeks
- **Multiple videos?** Click the video you want to control to make it active
