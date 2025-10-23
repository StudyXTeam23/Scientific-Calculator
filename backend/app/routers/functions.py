"""
Functions API Router

Provides information about available mathematical functions.
"""

from fastapi import APIRouter, Query
from typing import List, Optional
from app.models.calculator import FunctionInfo

router = APIRouter()

# Available functions with their information
FUNCTIONS_INFO: List[FunctionInfo] = [
    # Trigonometric functions
    FunctionInfo(
        name="sin",
        description="正弦函数",
        syntax="sin(x)",
        example="sin(30) = 0.5 (deg mode)",
        category="trigonometric"
    ),
    FunctionInfo(
        name="cos",
        description="余弦函数",
        syntax="cos(x)",
        example="cos(0) = 1",
        category="trigonometric"
    ),
    FunctionInfo(
        name="tan",
        description="正切函数",
        syntax="tan(x)",
        example="tan(45) = 1 (deg mode)",
        category="trigonometric"
    ),
    
    # Logarithmic functions
    FunctionInfo(
        name="log",
        description="常用对数（以10为底）",
        syntax="log(x)",
        example="log(100) = 2",
        category="logarithmic"
    ),
    FunctionInfo(
        name="ln",
        description="自然对数（以e为底）",
        syntax="ln(x)",
        example="ln(e) = 1",
        category="logarithmic"
    ),
    
    # Exponential functions
    FunctionInfo(
        name="exp",
        description="指数函数（e的x次方）",
        syntax="exp(x)",
        example="exp(1) = 2.718...",
        category="exponential"
    ),
    
    # Root functions
    FunctionInfo(
        name="sqrt",
        description="平方根",
        syntax="sqrt(x)",
        example="sqrt(16) = 4",
        category="root"
    ),
    FunctionInfo(
        name="cbrt",
        description="立方根",
        syntax="cbrt(x)",
        example="cbrt(27) = 3",
        category="root"
    ),
    
    # Rounding functions
    FunctionInfo(
        name="round",
        description="四舍五入",
        syntax="round(x)",
        example="round(3.7) = 4",
        category="rounding"
    ),
    FunctionInfo(
        name="floor",
        description="向下取整",
        syntax="floor(x)",
        example="floor(3.7) = 3",
        category="rounding"
    ),
    FunctionInfo(
        name="ceil",
        description="向上取整",
        syntax="ceil(x)",
        example="ceil(3.2) = 4",
        category="rounding"
    ),
    
    # Other functions
    FunctionInfo(
        name="abs",
        description="绝对值",
        syntax="abs(x)",
        example="abs(-5) = 5",
        category="basic"
    ),
]


@router.get("/functions", response_model=dict)
async def get_functions(
    category: Optional[str] = Query(None, description="Filter by category")
):
    """
    Get list of available mathematical functions
    
    Args:
        category: Optional category filter (trigonometric, logarithmic, etc.)
        
    Returns:
        Dictionary containing list of function information
    """
    functions = FUNCTIONS_INFO
    
    # Filter by category if specified
    if category:
        functions = [f for f in functions if f.category == category]
    
    return {
        "functions": functions,
        "total": len(functions)
    }


@router.get("/functions/categories", response_model=dict)
async def get_function_categories():
    """
    Get list of all function categories
    
    Returns:
        Dictionary containing list of categories
    """
    categories = list(set(f.category for f in FUNCTIONS_INFO))
    
    return {
        "categories": sorted(categories),
        "total": len(categories)
    }

