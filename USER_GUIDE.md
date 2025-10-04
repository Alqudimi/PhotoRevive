# Alqudimi Technology User Guide

Welcome to the complete guide for using Alqudimi Technology to restore your precious memories. This guide will walk you through everything you need to know.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Basic Photo Restoration](#basic-photo-restoration)
3. [Advanced Features](#advanced-features)
4. [Natural Language Instructions](#natural-language-instructions)
5. [Understanding the Options](#understanding-the-options)
6. [Tips for Best Results](#tips-for-best-results)
7. [Common Scenarios](#common-scenarios)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## Getting Started

### System Requirements

- **Web Browser**: Modern browser (Chrome, Firefox, Safari, Edge)
- **Internet Connection**: Stable connection for processing
- **Image Files**: JPG or PNG format, maximum 10MB

### Accessing the Application

1. Open your web browser
2. Navigate to the application URL
3. You'll see the landing page with example restorations

---

## Basic Photo Restoration

### Step 1: Upload Your Photo

1. Click the **"Upload Photo"** button or scroll to the upload section
2. You can either:
   - Click the upload zone to browse your files
   - Drag and drop an image directly onto the upload zone

### Step 2: Wait for Processing

Once uploaded, Alqudimi Technology will automatically process your photo through multiple stages:

- **Analyzing**: Initial image analysis
- **Restoring**: Damage removal and basic restoration
- **Colorizing**: Adding realistic colors (for B&W photos)
- **Enhancing**: Final quality improvement and upscaling

Processing typically takes 30-60 seconds depending on image complexity.

### Step 3: View and Download Results

After processing:

1. Use the interactive slider to compare before/after versions
2. Click **"Download"** to save the restored image
3. Click **"Restore Another"** to process more photos

---

## Advanced Features

### Accessing Advanced Options

Click **"Show Advanced Options"** below the instruction input field to reveal fine-tuning controls.

### Available Options

#### 1. Super-Resolution (SwinIR)
- **What it does**: Upscales and enhances image quality
- **When to use**: When you need larger, higher-quality images
- **Scale options**:
  - **2x**: Moderate enlargement, faster processing
  - **3x**: Balanced quality and size increase
  - **4x**: Maximum quality, larger file size

#### 2. Face Enhancement (CodeFormer)
- **What it does**: Restores and enhances facial features
- **When to use**: For portraits and group photos
- **Fidelity slider**:
  - **Low (0-0.3)**: Maximum enhancement, smoother appearance
  - **Medium (0.4-0.6)**: Balanced (recommended for most cases)
  - **High (0.7-1.0)**: Preserves original features, subtle enhancement

#### 3. Colorization (DDColor)
- **What it does**: Adds realistic colors to black-and-white photos
- **When to use**: Automatically applied to grayscale images
- **Results**: Natural, historically accurate colors

#### 4. Damage Removal (Inpainting)
- **What it does**: Removes scratches, tears, and damage
- **When to use**: Always recommended for old, damaged photos
- **Process**: Automatic detection and repair

---

## Natural Language Instructions

One of Alqudimi Technology's most powerful features is the ability to guide restoration with simple text instructions.

### How to Use Instructions

1. Locate the **"Alqudimi Instructions"** field above the upload zone
2. Type your instruction in plain English
3. Upload your photo - the instruction will be applied first

### Effective Instruction Examples

#### For Noisy Images
```
Remove noise and enhance details
```

#### For Blurry Photos
```
Fix the blur and improve sharpness
```

#### For General Enhancement
```
Make it look professional
```

#### For Damaged Photos
```
Remove scratches and restore damaged areas
```

#### For Quality Improvement
```
Enhance quality and brighten the colors
```

### Instruction Writing Tips

✅ **Do:**
- Be specific about what you want
- Use simple, clear language
- Focus on one main goal
- Mention specific issues (blur, noise, scratches)

❌ **Don't:**
- Write overly complex instructions
- Ask for impossible transformations
- Use technical jargon
- Request multiple unrelated changes

---

## Understanding the Options

### When to Enable Each Feature

| Feature | Enable When | Disable When |
|---------|-------------|--------------|
| Super-Resolution | You need larger images or want maximum quality | File size is a concern or image is already high-res |
| Face Enhancement | Photo contains faces that need improvement | No faces in the photo or faces are already clear |
| Colorization | Photo is black-and-white | Photo already has colors |
| Damage Removal | Photo has visible scratches or damage | Photo is in good condition |

### Recommended Settings by Photo Type

#### Old Family Portraits
- ✅ Super-Resolution: 2x or 3x
- ✅ Face Enhancement: 0.5 fidelity
- ✅ Colorization: Enabled (if B&W)
- ✅ Damage Removal: Enabled
- 📝 Instruction: "Restore faces and remove scratches"

#### Vintage Landscapes
- ✅ Super-Resolution: 3x or 4x
- ❌ Face Enhancement: Disabled
- ✅ Colorization: Enabled (if B&W)
- ✅ Damage Removal: Enabled
- 📝 Instruction: "Enhance details and remove damage"

#### Group Photos
- ✅ Super-Resolution: 2x
- ✅ Face Enhancement: 0.6 fidelity
- ✅ Colorization: Enabled (if B&W)
- ✅ Damage Removal: Enabled
- 📝 Instruction: "Restore all faces clearly"

#### Historical Documents/Photos
- ✅ Super-Resolution: 4x
- ❌ Face Enhancement: Disabled (unless faces present)
- ✅ Colorization: Enabled (if B&W)
- ✅ Damage Removal: Enabled
- 📝 Instruction: "Restore details and remove stains"

---

## Tips for Best Results

### Image Preparation

1. **Scan Quality**: Use at least 300 DPI when scanning physical photos
2. **File Format**: JPG or PNG work best
3. **File Size**: Keep under 10MB for best performance
4. **Lighting**: Scan in good, even lighting

### Optimization Strategies

#### For Faster Processing
- Use 2x super-resolution instead of 4x
- Disable face enhancement if no faces are present
- Provide a specific instruction to focus processing

#### For Best Quality
- Enable all features
- Use 4x super-resolution
- Set face fidelity to 0.5 for balanced results
- Add a detailed instruction

#### For File Size Management
- Use 2x super-resolution
- Save and then compress the result if needed
- Consider processing at lower resolution first

### Common Mistakes to Avoid

❌ **Don't:**
- Upload extremely large files (resize first if > 10MB)
- Process already-restored photos multiple times
- Disable all features (enable at least one)
- Use conflicting instructions ("make dark" and "brighten")

---

## Common Scenarios

### Scenario 1: Faded Color Photo

**Problem**: Old color photo with faded colors and scratches

**Solution**:
1. Enable Super-Resolution (3x)
2. Enable Face Enhancement (if faces present)
3. Enable Damage Removal
4. Instruction: "Enhance colors and remove scratches"

### Scenario 2: Black & White Portrait

**Problem**: Old B&W portrait with unclear face

**Solution**:
1. Enable Super-Resolution (2x)
2. Enable Face Enhancement (0.5 fidelity)
3. Enable Colorization
4. Enable Damage Removal
5. Instruction: "Restore face and add natural colors"

### Scenario 3: Damaged Landscape

**Problem**: Vintage landscape with tears and stains

**Solution**:
1. Enable Super-Resolution (4x)
2. Disable Face Enhancement
3. Enable Colorization (if B&W)
4. Enable Damage Removal
5. Instruction: "Remove damage and enhance landscape details"

### Scenario 4: Blurry Group Photo

**Problem**: Group photo that's slightly blurry

**Solution**:
1. Enable Super-Resolution (3x)
2. Enable Face Enhancement (0.6 fidelity)
3. Enable Colorization (if needed)
4. Disable Damage Removal (if no damage)
5. Instruction: "Fix blur and enhance all faces"

### Scenario 5: Low-Resolution Image

**Problem**: Very small image that needs enlargement

**Solution**:
1. Enable Super-Resolution (4x)
2. Enable Face Enhancement (if applicable)
3. Keep other options as needed
4. Instruction: "Enhance details for printing"

---

## Troubleshooting

### Issue: Processing Takes Too Long

**Possible Causes:**
- Large image file
- All features enabled
- Complex instruction

**Solutions:**
- Reduce image size before upload
- Disable unnecessary features
- Use simpler instruction
- Try a 2x scale instead of 4x

### Issue: Results Don't Look Good

**Possible Causes:**
- Wrong settings for photo type
- Poor quality original
- Conflicting options

**Solutions:**
- Try different fidelity settings
- Disable some features and retry
- Use a more specific instruction
- Ensure original is best quality available

### Issue: Colors Look Unnatural

**Possible Causes:**
- Colorization on already-colored photo
- Unusual lighting in original

**Solutions:**
- Disable colorization if photo has colors
- Try instruction: "Enhance natural colors"
- Process without colorization first

### Issue: Faces Look Too Smooth

**Possible Causes:**
- Face fidelity set too low
- Over-processing

**Solutions:**
- Increase fidelity to 0.7-0.9
- Disable face enhancement and use super-resolution only
- Add instruction: "Preserve natural texture"

### Issue: Upload Fails

**Possible Causes:**
- File too large
- Unsupported format
- Connection issue

**Solutions:**
- Compress image to under 10MB
- Convert to JPG or PNG
- Check internet connection
- Refresh page and try again

---

## FAQ

### How long does processing take?
Typically 30-60 seconds, but can take up to 2 minutes for complex images with all features enabled.

### Can I process multiple photos at once?
Currently, photos are processed one at a time. Process each photo individually for best results.

### What happens to my photos?
Photos are processed securely and not stored permanently. They're automatically deleted after processing.

### Can I cancel processing?
Once started, processing cannot be cancelled. Wait for completion or refresh the page.

### How do I get the best results?
Enable all features, use a clear instruction, and start with the best quality original you have.

### What if I'm not happy with results?
Try different settings! Experiment with fidelity levels, scales, and instructions. Each photo is unique.

### Can I use this for commercial purposes?
Check the license terms for commercial use restrictions.

### Is there a cost?
The application uses API credits. Check with your administrator about usage costs.

### What's the maximum image size?
10MB per file. Larger files should be resized before upload.

### Can I restore torn photos?
Yes! Enable damage removal and use instruction: "Repair torn areas and restore image"

### How do I prepare scanned photos?
Scan at 300+ DPI, save as JPG or PNG, ensure good lighting, and keep file under 10MB.

### Can I edit the restored image further?
Yes! Download the result and use any image editor for additional adjustments.

---

## Support

If you encounter issues not covered in this guide:

1. Check the troubleshooting section above
2. Review the API_DOCUMENTATION.md for technical details
3. Contact support through the appropriate channels
4. Check project GitHub for known issues

---

## Tips from Expert Users

💡 **Pro Tip 1**: Process the same photo with different instructions to compare results

💡 **Pro Tip 2**: For very damaged photos, process twice: once for damage removal, then again for enhancement

💡 **Pro Tip 3**: Keep original files! Always save both before and after versions

💡 **Pro Tip 4**: For printing, use 4x super-resolution with all enhancements

💡 **Pro Tip 5**: Be specific in instructions - "remove vertical scratch on left side" works better than "fix damage"

---

**Enjoy restoring your precious memories with Alqudimi Technology!**

For technical documentation, see:
- ALQUDIMI_TECHNOLOGY.md - Technology overview
- API_DOCUMENTATION.md - API reference
- DEVELOPER_GUIDE.md - Developer information
