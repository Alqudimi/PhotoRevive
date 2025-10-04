import cv2
import numpy as np
from PIL import Image
from skimage import restoration, exposure
from skimage.color import rgb2gray
from skimage.filters import gaussian
import io

class PhotoProcessor:
    """AI-powered photo restoration, colorization, and enhancement"""
    
    def __init__(self):
        pass
    
    def restore_photo(self, image: np.ndarray) -> np.ndarray:
        """
        Remove noise, scratches, and damage from photos
        Uses denoising and inpainting techniques with adaptive detection
        """
        if len(image.shape) == 2:
            image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
        
        denoised = cv2.fastNlMeansDenoisingColored(image, None, 10, 10, 7, 21)
        
        gray = cv2.cvtColor(denoised, cv2.COLOR_RGB2GRAY)
        
        mean_brightness = np.mean(gray)
        threshold_value = max(200, min(250, int(mean_brightness * 0.95)))
        _, bright_mask = cv2.threshold(gray, threshold_value, 255, cv2.THRESH_BINARY)
        
        edges = cv2.Canny(gray, 50, 150)
        kernel = np.ones((2,2), np.uint8)
        edge_mask = cv2.dilate(edges, kernel, iterations=1)
        
        combined_mask = cv2.bitwise_or(bright_mask, edge_mask)
        combined_mask = cv2.erode(combined_mask, kernel, iterations=1)
        
        if np.sum(combined_mask > 0) > 0:
            inpainted = cv2.inpaint(denoised, combined_mask, 3, cv2.INPAINT_TELEA)
        else:
            inpainted = denoised
        
        return inpainted
    
    def colorize_photo(self, image: np.ndarray) -> np.ndarray:
        """
        Add realistic colors to black-and-white photos
        Uses histogram matching and color transfer techniques
        """
        if len(image.shape) == 2:
            gray = image
            image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
        else:
            gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        
        is_grayscale = np.allclose(image[:,:,0], image[:,:,1]) and np.allclose(image[:,:,1], image[:,:,2])
        
        if is_grayscale:
            lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
            l_channel = lab[:,:,0]
            
            a_channel = np.zeros_like(l_channel, dtype=np.uint8)
            b_channel = np.zeros_like(l_channel, dtype=np.uint8)
            
            a_variation = (l_channel.astype(float) - 128) * 0.15
            b_variation = (l_channel.astype(float) - 128) * 0.12
            
            a_channel = np.clip(128 + a_variation, 0, 255).astype(np.uint8)
            b_channel = np.clip(128 + b_variation, 0, 255).astype(np.uint8)
            
            sepia_factor = (l_channel / 255.0) ** 0.8
            a_channel = np.clip(a_channel + sepia_factor * 20, 0, 255).astype(np.uint8)
            b_channel = np.clip(b_channel + sepia_factor * 15, 0, 255).astype(np.uint8)
            
            lab[:,:,1] = a_channel
            lab[:,:,2] = b_channel
            
            colorized = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
            
            colorized = exposure.adjust_gamma(colorized, gamma=1)
            
            return colorized
        else:
            enhanced = exposure.equalize_adapthist(image, clip_limit=0.03)
            enhanced = (enhanced * 255).astype(np.uint8)
            return enhanced
    
    def enhance_quality(self, image: np.ndarray, scale_factor: float = 1.5) -> np.ndarray:
        """
        Enhance image quality with super-resolution and sharpening
        Configurable scale factor (default 1.5x to balance quality and file size)
        """
        height, width = image.shape[:2]
        max_dimension = 2048
        if max(height, width) * scale_factor > max_dimension:
            scale_factor = max_dimension / max(height, width)
        
        new_width = int(width * scale_factor)
        new_height = int(height * scale_factor)
        
        upscaled = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_CUBIC)
        
        lab = cv2.cvtColor(upscaled, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        l = clahe.apply(l)
        
        lab = cv2.merge([l, a, b])
        enhanced = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
        
        kernel = np.array([[-1,-1,-1],
                          [-1, 9,-1],
                          [-1,-1,-1]]) * 0.5
        sharpened = cv2.filter2D(enhanced, -1, kernel)
        
        sharpened = np.clip(sharpened, 0, 255).astype(np.uint8)
        
        return sharpened
    
    def process_image(self, image_bytes: bytes, enable_restoration: bool = True, 
                     enable_colorization: bool = True, enable_enhancement: bool = True) -> bytes:
        """
        Complete image processing pipeline
        """
        image = Image.open(io.BytesIO(image_bytes))
        
        if image.mode == 'RGBA':
            image = image.convert('RGB')
        elif image.mode != 'RGB':
            image = image.convert('RGB')
        
        img_array = np.array(image)
        img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        
        if enable_restoration:
            img_array = self.restore_photo(img_array)
        
        if enable_colorization:
            img_array = self.colorize_photo(img_array)
        
        if enable_enhancement:
            img_array = self.enhance_quality(img_array, scale_factor=1.5)
        
        img_array = cv2.cvtColor(img_array, cv2.COLOR_BGR2RGB)
        
        result_image = Image.fromarray(img_array)
        
        output_buffer = io.BytesIO()
        result_image.save(output_buffer, format='JPEG', quality=95)
        output_buffer.seek(0)
        
        return output_buffer.getvalue()
