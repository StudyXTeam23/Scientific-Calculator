from fastapi import APIRouter, HTTPException, status
from app.models.calculator import CalculateRequest, CalculateResponse

router = APIRouter()

@router.post("/calculate", response_model=CalculateResponse)
async def calculate(request: CalculateRequest):
    """
    计算数学表达式
    
    Args:
        request: 包含表达式和计算参数的请求体
        
    Returns:
        计算结果或错误信息
    """
    from app.services.calculation import CalculationService
    from app.services.validation import ValidationService
    
    # 验证表达式
    validation_result = ValidationService.validate_expression(request.expression)
    if not validation_result['valid']:
        return CalculateResponse(
            success=False,
            result=None,
            expression=request.expression,
            formatted_expression=None,
            error=validation_result.get('error', 'Invalid expression'),
            computation_time_ms=0.0
        )
    
    try:
        # 计算
        result, computation_time = CalculationService.evaluate(
            request.expression,
            request.angle_mode,
            request.precision or 10
        )
        
        # 格式化表达式
        formatted_expr = CalculationService.format_expression(
            request.expression,
            request.angle_mode
        )
        
        return CalculateResponse(
            success=True,
            result=str(result),
            expression=request.expression,
            formatted_expression=formatted_expr,
            error=None,
            computation_time_ms=computation_time
        )
        
    except ValueError as e:
        return CalculateResponse(
            success=False,
            result=None,
            expression=request.expression,
            formatted_expression=None,
            error=str(e),
            computation_time_ms=0.0
        )
    except Exception as e:
        return CalculateResponse(
            success=False,
            result=None,
            expression=request.expression,
            formatted_expression=None,
            error=f"Unexpected error: {str(e)}",
            computation_time_ms=0.0
        )

