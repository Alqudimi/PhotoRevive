# Alqudimi Technology API Documentation

## Overview

This document describes the REST API endpoints for the Alqudimi Technology photo restoration service. All endpoints accept multipart form data for image uploads and return processed images or JSON responses.

## Base URL

```
http://localhost:5000
```

## Authentication

Currently, no authentication is required for local development. API keys are managed internally for external AI services.

## Endpoints

### Health Check

#### GET /api/health

Check if the API service is running and healthy.

**Response:**
```json
{
  "status": "healthy",
  "technology": "Alqudimi",
  "ai_enabled": true
}
```

**Status Codes:**
- `200 OK`: Service is healthy

---

### Root Information

#### GET /

Get basic information about the API service.

**Response:**
```json
{
  "message": "Smart Photo Reviver API - Alqudimi Technology",
  "status": "running",
  "technology": "Alqudimi",
  "models": {
    "super_resolution": "SwinIR",
    "face_enhancement": "CodeFormer",
    "colorization": "DDColor",
    "instruction_control": "InstructIR"
  }
}
```

---

### Full Photo Restoration

#### POST /api/restore

Process an image through the complete Alqudimi restoration pipeline with all AI models.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| file | File | Yes | - | Image file (max 10MB, JPG/PNG) |
| instruction | String | No | null | Natural language instruction for InstructIR |
| enable_super_resolution | Boolean | No | true | Apply SwinIR super-resolution |
| enable_face_enhancement | Boolean | No | true | Apply CodeFormer face enhancement |
| enable_colorization | Boolean | No | true | Apply DDColor colorization |
| enable_inpainting | Boolean | No | true | Apply damage removal inpainting |
| sr_scale | Integer | No | 2 | Super-resolution scale (2-4) |
| face_fidelity | Float | No | 0.5 | CodeFormer fidelity (0-1) |

**Example Request (cURL):**
```bash
curl -X POST http://localhost:5000/api/restore \
  -F "file=@old_photo.jpg" \
  -F "instruction=Remove noise and enhance details" \
  -F "enable_super_resolution=true" \
  -F "enable_face_enhancement=true" \
  -F "enable_colorization=true" \
  -F "enable_inpainting=true" \
  -F "sr_scale=2" \
  -F "face_fidelity=0.5" \
  --output restored_photo.jpg
```

**Example Request (JavaScript):**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('instruction', 'Enhance quality and remove scratches');
formData.append('sr_scale', '3');
formData.append('face_fidelity', '0.7');

const response = await fetch('/api/restore', {
  method: 'POST',
  body: formData
});

const blob = await response.blob();
const imageUrl = URL.createObjectURL(blob);
```

**Response:**
- Content-Type: `image/jpeg`
- Body: Processed image data

**Status Codes:**
- `200 OK`: Image processed successfully
- `400 Bad Request`: Invalid file or parameters
- `500 Internal Server Error`: Processing failed

---

### Super-Resolution Only

#### POST /api/super-resolution

Apply SwinIR super-resolution to an image without other enhancements.

**Request Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| file | File | Yes | - | Image file (max 10MB) |
| scale | Integer | No | 4 | Upscaling factor (2, 3, or 4) |

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/super-resolution \
  -F "file=@photo.jpg" \
  -F "scale=4" \
  --output upscaled_photo.jpg
```

**Response:**
- Content-Type: `image/jpeg`
- Body: Upscaled image

---

### Colorization Only

#### POST /api/colorize

Apply DDColor colorization to a black-and-white image.

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| file | File | Yes | Image file (max 10MB) |

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/colorize \
  -F "file=@bw_photo.jpg" \
  --output colorized_photo.jpg
```

**Response:**
- Content-Type: `image/jpeg`
- Body: Colorized image

---

### Face Enhancement Only

#### POST /api/face-enhance

Apply CodeFormer face enhancement to an image.

**Request Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| file | File | Yes | - | Image file (max 10MB) |
| fidelity | Float | No | 0.5 | Fidelity parameter (0-1) |

**Fidelity Parameter Guide:**
- `0.0 - 0.3`: Maximum enhancement, more smoothing
- `0.4 - 0.6`: Balanced enhancement (recommended)
- `0.7 - 1.0`: High fidelity, minimal modification

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/face-enhance \
  -F "file=@portrait.jpg" \
  -F "fidelity=0.6" \
  --output enhanced_portrait.jpg
```

**Response:**
- Content-Type: `image/jpeg`
- Body: Face-enhanced image

---

### Instruction-Based Restoration

#### POST /api/instruct

Apply InstructIR with natural language instructions.

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| file | File | Yes | Image file (max 10MB) |
| instruction | String | Yes | Natural language instruction |

**Example Instructions:**
- "Remove noise and enhance details"
- "Fix the blur and improve sharpness"
- "Make it look professional"
- "Remove scratches and restore quality"
- "Enhance lighting and remove grain"

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/instruct \
  -F "file=@photo.jpg" \
  -F "instruction=Remove noise and enhance details" \
  --output restored_photo.jpg
```

**Response:**
- Content-Type: `image/jpeg`
- Body: Restored image based on instruction

---

### Step-by-Step Restoration

#### POST /api/restore-step

Apply specific restoration steps individually or all together.

**Request Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| file | File | Yes | - | Image file (max 10MB) |
| step | String | No | "all" | Processing step to apply |
| instruction | String | No | null | Optional instruction |

**Valid Step Values:**
- `super_resolution`: Apply SwinIR only
- `face_enhancement`: Apply CodeFormer only
- `colorization`: Apply DDColor only
- `inpainting`: Apply damage removal only
- `instruction`: Apply InstructIR with instruction
- `all`: Apply all steps (default)

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/restore-step \
  -F "file=@photo.jpg" \
  -F "step=colorization" \
  --output colorized_photo.jpg
```

---

## Error Handling

### Error Response Format

All error responses follow this format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

### Common Error Codes

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| 400 Bad Request | Invalid input | Missing file, wrong format, invalid parameters |
| 413 Payload Too Large | File too large | File exceeds 10MB limit |
| 415 Unsupported Media Type | Invalid file type | File is not an image |
| 500 Internal Server Error | Processing failed | AI model error, insufficient resources |
| 503 Service Unavailable | Service down | API unavailable, rate limit exceeded |

---

## Rate Limiting

Currently, no rate limiting is enforced for local development. For production deployments, consider implementing rate limiting based on your infrastructure.

---

## Response Headers

All image responses include these headers:

```
Content-Type: image/jpeg
Content-Disposition: attachment; filename=restored_[original_filename]
Cache-Control: no-cache
```

---

## Performance Considerations

### Processing Times

| Operation | Typical Time | Factors |
|-----------|-------------|---------|
| Full Pipeline | 30-120s | Image size, enabled models |
| Super-Resolution | 15-30s | Scale factor, image complexity |
| Colorization | 5-15s | Image size |
| Face Enhancement | 10-25s | Number of faces |
| Instruction-Based | 20-40s | Instruction complexity |

### Optimization Tips

1. **Disable Unused Models**: Only enable models you need
2. **Lower Scale Factors**: Use 2x instead of 4x when appropriate
3. **Compress Input**: Reduce image size before upload if quality allows
4. **Sequential Processing**: Process images one at a time for consistent performance

---

## SDK Examples

### Python

```python
import requests

def restore_photo(image_path, instruction=None):
    with open(image_path, 'rb') as f:
        files = {'file': f}
        data = {
            'instruction': instruction or '',
            'sr_scale': 2,
            'face_fidelity': 0.5
        }
        
        response = requests.post(
            'http://localhost:5000/api/restore',
            files=files,
            data=data
        )
        
        if response.ok:
            with open('restored.jpg', 'wb') as output:
                output.write(response.content)
            return 'restored.jpg'
        else:
            raise Exception(f"Error: {response.json()['detail']}")

# Usage
restored = restore_photo('old_photo.jpg', 'Enhance and remove scratches')
```

### Node.js

```javascript
const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function restorePhoto(imagePath, instruction) {
  const form = new FormData();
  form.append('file', fs.createReadStream(imagePath));
  form.append('instruction', instruction || '');
  form.append('sr_scale', '2');
  form.append('face_fidelity', '0.5');
  
  const response = await fetch('http://localhost:5000/api/restore', {
    method: 'POST',
    body: form
  });
  
  if (response.ok) {
    const buffer = await response.buffer();
    fs.writeFileSync('restored.jpg', buffer);
    return 'restored.jpg';
  } else {
    const error = await response.json();
    throw new Error(error.detail);
  }
}

// Usage
restorePhoto('old_photo.jpg', 'Enhance and remove scratches')
  .then(path => console.log('Restored:', path))
  .catch(err => console.error('Error:', err));
```

---

## Testing

### Health Check Test

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status": "healthy", "technology": "Alqudimi", "ai_enabled": true}
```

### Basic Restoration Test

```bash
curl -X POST http://localhost:5000/api/restore \
  -F "file=@test_image.jpg" \
  --output result.jpg
```

---

## Support

For API issues or questions:
- Check the logs for detailed error messages
- Verify your Replicate API key is configured
- Ensure input images meet size and format requirements
- Review the USER_GUIDE.md for common issues

---

**Alqudimi Technology API** - Version 1.0
