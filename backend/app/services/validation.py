"""
Validation Service

Handles input validation and security checks for mathematical expressions.
"""

import re
from typing import Dict, List


class ValidationService:
    """Expression validation and security service"""
    
    # Dangerous keywords that should never appear in expressions
    DANGEROUS_KEYWORDS: List[str] = [
        '__import__', 'eval', 'exec', 'compile',
        'open', 'input', 'file', 'import',
        '__', 'lambda', 'class', 'def',
    ]
    
    # Allowed mathematical functions (whitelist approach)
    ALLOWED_FUNCTIONS: List[str] = [
        'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
        'sinh', 'cosh', 'tanh',
        'log', 'ln', 'exp', 'sqrt', 'cbrt',
        'abs', 'round', 'floor', 'ceil',
        'pi', 'e', 'mod', 'factorial',
        'random',
    ]
    
    @staticmethod
    def validate_expression(expression: str) -> Dict[str, any]:
        """
        Validate a mathematical expression for safety and correctness
        
        Args:
            expression: The expression to validate
            
        Returns:
            Dictionary with 'valid' (bool) and optional 'error' (str)
        """
        # Check if empty
        if not expression or not expression.strip():
            return {
                'valid': False,
                'error': 'Expression cannot be empty'
            }
        
        # Check length
        if len(expression) > 500:
            return {
                'valid': False,
                'error': 'Expression too long (max 500 characters)'
            }
        
        # Check for dangerous keywords
        expr_lower = expression.lower()
        for keyword in ValidationService.DANGEROUS_KEYWORDS:
            if keyword in expr_lower:
                return {
                    'valid': False,
                    'error': f'Forbidden keyword: {keyword}'
                }
        
        # Check for valid characters only
        # Allow: digits, operators, parentheses, letters (for functions), spaces, dot
        allowed_pattern = r'^[0-9+\-*/().,\s\^a-zA-Z×÷πℯ!]+$'
        if not re.match(allowed_pattern, expression):
            return {
                'valid': False,
                'error': 'Expression contains invalid characters'
            }
        
        # Check parentheses matching
        open_count = expression.count('(')
        close_count = expression.count(')')
        if open_count != close_count:
            return {
                'valid': False,
                'error': 'Unmatched parentheses'
            }
        
        # Check for balanced parentheses order
        balance = 0
        for char in expression:
            if char == '(':
                balance += 1
            elif char == ')':
                balance -= 1
            if balance < 0:
                return {
                    'valid': False,
                    'error': 'Invalid parentheses order'
                }
        
        # All checks passed
        return {'valid': True}
    
    @staticmethod
    def sanitize_expression(expression: str) -> str:
        """
        Sanitize expression by removing potentially dangerous content
        
        Args:
            expression: Raw expression
            
        Returns:
            Sanitized expression
        """
        # Remove any whitespace padding
        sanitized = expression.strip()
        
        # Remove multiple spaces
        sanitized = re.sub(r'\s+', ' ', sanitized)
        
        # Remove any null bytes or special characters
        sanitized = sanitized.replace('\x00', '')
        sanitized = sanitized.replace('\n', '')
        sanitized = sanitized.replace('\r', '')
        
        return sanitized

