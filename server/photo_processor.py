import cv2
import numpy as np
from PIL import Image
import io
import os
import replicate
import base64
import asyncio
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

class AIPhotoProcessor:
    """
    Alqudimi Technology - Advanced photo restoration using state-of-the-art models:
    - SwinIR: Super-resolution and general restoration
    - CodeFormer: Face enhancement
    - DDColor: Photo-realistic colorization
    - InstructIR: Text-based instruction control
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the AI Photo Processor
        Args:
            api_key: Replicate API key (falls back to REPLICATE_API_TOKEN env var)
        """
        self.api_key = api_key or os.environ.get('REPLICATE_API_TOKEN')
        if self.api_key:
            os.environ['REPLICATE_API_TOKEN'] = self.api_key
        
        self.model_versions = {
            'swinir': 'jingyunliang/swinir',
            'codeformer': 'sczhou/codeformer',
            'ddcolor': 'piddnad/ddcolor',
            'instructir': 'mv-lab/instructir'
        }
    
    def _image_to_data_uri(self, image: np.ndarray) -> str:
        """Convert numpy array to data URI for API"""
        if len(image.shape) == 2:
            image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
        
        pil_image = Image.fromarray(image)
        buffer = io.BytesIO()
        pil_image.save(buffer, format='PNG')
        buffer.seek(0)
        
        base64_data = base64.b64encode(buffer.getvalue()).decode('utf-8')
        return f"data:image/png;base64,{base64_data}"
    
    def _download_image_from_url(self, url: str) -> np.ndarray:
        """Download image from URL and convert to numpy array"""
        import requests
        response = requests.get(url)
        response.raise_for_status()
        
        image = Image.open(io.BytesIO(response.content))
        if image.mode == 'RGBA':
            image = image.convert('RGB')
        elif image.mode != 'RGB':
            image = image.convert('RGB')
        
        return np.array(image)
    
    def super_resolution(self, image: np.ndarray, scale: int = 4, task: str = 'real_sr') -> np.ndarray:
        """
        Enhance image quality using SwinIR super-resolution
        
        Args:
            image: Input image as numpy array
            scale: Upscaling factor (2, 3, 4, or 8)
            task: 'real_sr' (real-world), 'classical_sr', 'gray_dn', 'color_dn', or 'jpeg_car'
        
        Returns:
            Enhanced image as numpy array
        """
        if not self.api_key:
            logger.warning("No Replicate API key found. Falling back to basic upscaling.")
            return self._fallback_super_resolution(image, scale)
        
        try:
            logger.info(f"Running SwinIR super-resolution: scale={scale}, task={task}")
            
            data_uri = self._image_to_data_uri(image)
            
            output = replicate.run(
                self.model_versions['swinir'],
                input={
                    "image": data_uri,
                    "task": task,
                    "scale": scale
                }
            )
            
            if isinstance(output, str):
                result = self._download_image_from_url(output)
            else:
                result = self._download_image_from_url(str(output))
            
            logger.info("SwinIR processing completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"SwinIR processing failed: {str(e)}")
            return self._fallback_super_resolution(image, scale)
    
    def face_enhancement(self, image: np.ndarray, fidelity: float = 0.5, 
                        upscale: int = 2, face_upsample: bool = True) -> np.ndarray:
        """
        Enhance faces using CodeFormer
        
        Args:
            image: Input image as numpy array
            fidelity: Balance between quality (0) and fidelity (1). 0.5 is recommended.
            upscale: Upscaling factor (1, 2, 3, or 4)
            face_upsample: Whether to upsample faces separately
        
        Returns:
            Face-enhanced image as numpy array
        """
        if not self.api_key:
            logger.warning("No Replicate API key found. Skipping face enhancement.")
            return image
        
        try:
            logger.info(f"Running CodeFormer face enhancement: fidelity={fidelity}, upscale={upscale}")
            
            data_uri = self._image_to_data_uri(image)
            
            output = replicate.run(
                self.model_versions['codeformer'],
                input={
                    "image": data_uri,
                    "codeformer_fidelity": fidelity,
                    "upscale": upscale,
                    "face_upsample": face_upsample,
                    "background_enhance": True
                }
            )
            
            if isinstance(output, str):
                result = self._download_image_from_url(output)
            else:
                result = self._download_image_from_url(str(output))
            
            logger.info("CodeFormer processing completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"CodeFormer processing failed: {str(e)}")
            return image
    
    def colorize_photo(self, image: np.ndarray, model_name: str = 'ddcolor_modelscope') -> np.ndarray:
        """
        Colorize black-and-white photos using DDColor
        
        Args:
            image: Input image as numpy array
            model_name: 'ddcolor_paper', 'ddcolor_modelscope', 'ddcolor_artistic', or 'ddcolor_paper_tiny'
        
        Returns:
            Colorized image as numpy array
        """
        if not self.api_key:
            logger.warning("No Replicate API key found. Falling back to basic colorization.")
            return self._fallback_colorization(image)
        
        try:
            logger.info(f"Running DDColor colorization: model={model_name}")
            
            data_uri = self._image_to_data_uri(image)
            
            output = replicate.run(
                self.model_versions['ddcolor'],
                input={
                    "image": data_uri,
                    "model_name": model_name
                }
            )
            
            if isinstance(output, str):
                result = self._download_image_from_url(output)
            else:
                result = self._download_image_from_url(str(output))
            
            logger.info("DDColor processing completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"DDColor processing failed: {str(e)}")
            return self._fallback_colorization(image)
    
    def instruct_restore(self, image: np.ndarray, instruction: str) -> np.ndarray:
        """
        Restore image using natural language instructions with InstructIR
        
        Args:
            image: Input image as numpy array
            instruction: Natural language instruction (e.g., "Remove noise and enhance details")
        
        Returns:
            Restored image as numpy array
        """
        if not self.api_key:
            logger.warning("No Replicate API key found. Skipping instructional restoration.")
            return image
        
        try:
            logger.info(f"Running InstructIR with instruction: '{instruction}'")
            
            data_uri = self._image_to_data_uri(image)
            
            output = replicate.run(
                self.model_versions['instructir'],
                input={
                    "image": data_uri,
                    "prompt": instruction
                }
            )
            
            if isinstance(output, str):
                result = self._download_image_from_url(output)
            else:
                result = self._download_image_from_url(str(output))
            
            logger.info("InstructIR processing completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"InstructIR processing failed: {str(e)}")
            return image
    
    def _fallback_super_resolution(self, image: np.ndarray, scale: int) -> np.ndarray:
        """Fallback super-resolution using OpenCV"""
        height, width = image.shape[:2]
        new_width = int(width * scale)
        new_height = int(height * scale)
        
        upscaled = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_CUBIC)
        
        lab = cv2.cvtColor(upscaled, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        l = clahe.apply(l)
        
        lab = cv2.merge([l, a, b])
        enhanced = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
        
        return enhanced
    
    def _fallback_colorization(self, image: np.ndarray) -> np.ndarray:
        """Fallback colorization using OpenCV"""
        if len(image.shape) == 2:
            gray = image
            image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
        else:
            gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        
        is_grayscale = np.allclose(image[:,:,0], image[:,:,1]) and np.allclose(image[:,:,1], image[:,:,2])
        
        if is_grayscale:
            lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
            l_channel = lab[:,:,0]
            
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
            return colorized
        
        return image
    
    def process_image(self, image_bytes: bytes, 
                     enable_super_resolution: bool = True,
                     enable_face_enhancement: bool = True,
                     enable_colorization: bool = True,
                     enable_inpainting: bool = True,
                     instruction: Optional[str] = None,
                     sr_scale: int = 2,
                     face_fidelity: float = 0.5) -> bytes:
        """
        Complete Alqudimi Technology image processing pipeline
        
        Args:
            image_bytes: Input image as bytes
            enable_super_resolution: Apply SwinIR super-resolution
            enable_face_enhancement: Apply CodeFormer face enhancement
            enable_colorization: Apply DDColor colorization
            enable_inpainting: Apply basic inpainting for damage removal
            instruction: Optional natural language instruction for InstructIR
            sr_scale: Super-resolution scale factor (2, 3, or 4)
            face_fidelity: CodeFormer fidelity (0-1, lower = more enhancement)
        
        Returns:
            Processed image as bytes (JPEG format)
        """
        image = Image.open(io.BytesIO(image_bytes))
        
        if image.mode == 'RGBA':
            image = image.convert('RGB')
        elif image.mode != 'RGB':
            image = image.convert('RGB')
        
        img_array = np.array(image)
        
        logger.info("Starting Alqudimi photo restoration pipeline")
        
        if instruction:
            logger.info(f"Using InstructIR with instruction: {instruction}")
            img_array = self.instruct_restore(img_array, instruction)
        
        if enable_inpainting:
            logger.info("Applying inpainting for damage removal")
            img_array = self._apply_basic_inpainting(img_array)
        
        if enable_colorization:
            is_grayscale = self._is_grayscale(img_array)
            if is_grayscale:
                logger.info("Detected grayscale image, applying colorization")
                img_array = self.colorize_photo(img_array)
        
        if enable_face_enhancement:
            logger.info("Applying face enhancement")
            img_array = self.face_enhancement(img_array, fidelity=face_fidelity, upscale=1)
        
        if enable_super_resolution:
            logger.info(f"Applying super-resolution (scale={sr_scale})")
            img_array = self.super_resolution(img_array, scale=sr_scale)
        
        result_image = Image.fromarray(img_array)
        
        output_buffer = io.BytesIO()
        result_image.save(output_buffer, format='JPEG', quality=95)
        output_buffer.seek(0)
        
        logger.info("Photo restoration pipeline completed successfully")
        return output_buffer.getvalue()
    
    def _apply_basic_inpainting(self, image: np.ndarray) -> np.ndarray:
        """Apply basic inpainting for damage and scratch removal"""
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
            return inpainted
        
        return denoised
    
    def _is_grayscale(self, image: np.ndarray) -> bool:
        """Check if image is grayscale"""
        if len(image.shape) == 2:
            return True
        return np.allclose(image[:,:,0], image[:,:,1]) and np.allclose(image[:,:,1], image[:,:,2])


PhotoProcessor = AIPhotoProcessor
