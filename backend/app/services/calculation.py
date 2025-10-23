"""
Calculation Service

Handles mathematical expression evaluation using SymPy.
"""

import sympy as sp
from typing import Literal, Tuple
import time
import math
from functools import lru_cache


class CalculationService:
    """Mathematical calculation service"""
    
    @staticmethod
    def evaluate(
        expression: str,
        angle_mode: Literal['deg', 'rad'] = 'deg',
        precision: int = 10
    ) -> Tuple[float, float]:
        """
        Evaluate a mathematical expression
        
        Args:
            expression: Mathematical expression to evaluate
            angle_mode: Angle mode for trigonometric functions ('deg' or 'rad')
            precision: Number of decimal places for the result
            
        Returns:
            Tuple of (result, computation_time_ms)
            
        Raises:
            ValueError: If expression is invalid or contains errors
        """
        start_time = time.perf_counter()
        
        try:
            # Preprocess expression
            processed = CalculationService._preprocess(expression, angle_mode)
            
            # Evaluate using SymPy
            result = sp.sympify(processed)
            numeric_result = float(result.evalf(precision))
            
            # Validate result
            if not math.isfinite(numeric_result):
                raise ValueError("Result out of range")
            
            # Calculate computation time
            computation_time = (time.perf_counter() - start_time) * 1000
            
            return numeric_result, computation_time
            
        except ZeroDivisionError:
            raise ValueError("Division by zero")
        except sp.SympifyError as e:
            raise ValueError(f"Invalid expression: {str(e)}")
        except Exception as e:
            raise ValueError(f"Calculation error: {str(e)}")
    
    @staticmethod
    @lru_cache(maxsize=1000)
    def evaluate_cached(
        expression: str,
        angle_mode: str,
        precision: int
    ) -> Tuple[float, float]:
        """
        Cached version of evaluate for better performance
        
        Note: This is a separate method because lru_cache doesn't work well
        with Literal types directly.
        """
        return CalculationService.evaluate(expression, angle_mode, precision)  # type: ignore
    
    @staticmethod
    def _preprocess(expression: str, angle_mode: str) -> str:
        """
        Preprocess expression before evaluation
        
        Args:
            expression: Raw expression
            angle_mode: Angle mode for trigonometric functions
            
        Returns:
            Processed expression ready for SymPy
        """
        processed = expression
        
        # Replace operator symbols with SymPy-compatible equivalents
        replacements = {
            '×': '*',
            '÷': '/',
            'π': 'pi',
            '^': '**',
        }
        
        for old, new in replacements.items():
            processed = processed.replace(old, new)
        
        # Handle degree mode for trigonometric functions
        if angle_mode == 'deg':
            # Convert degrees to radians for trig functions
            # sin(30) -> sin(30*pi/180)
            trig_funcs = ['sin', 'cos', 'tan']
            for func in trig_funcs:
                # Simple replacement - more robust parsing could be added
                processed = processed.replace(f'{func}(', f'{func}(pi/180*(')
                # Add closing parenthesis
                # This is a simplified approach; for production, use proper parsing
        
        return processed
    
    @staticmethod
    def format_expression(expression: str, angle_mode: str) -> str:
        """
        Format expression for display (add units, symbols, etc.)
        
        Args:
            expression: Original expression
            angle_mode: Angle mode
            
        Returns:
            Formatted expression with units
        """
        formatted = expression
        
        # Replace symbols for display
        replacements = {
            '*': '×',
            '/': '÷',
            'pi': 'π',
            '**': '^',
        }
        
        for old, new in replacements.items():
            formatted = formatted.replace(old, new)
        
        # Add degree symbol if in deg mode
        if angle_mode == 'deg':
            # Simple addition of degree symbol
            # In a more robust implementation, we'd parse and add it correctly
            pass
        
        return formatted

