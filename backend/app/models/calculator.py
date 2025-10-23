from pydantic import BaseModel, Field, field_validator
from typing import Literal, Optional

class CalculateRequest(BaseModel):
    """计算请求"""
    expression: str = Field(..., description="数学表达式", max_length=500)
    angle_mode: Literal['deg', 'rad'] = Field(default='deg', description="角度模式")
    precision: Optional[int] = Field(default=10, ge=1, le=15, description="结果精度")
    
    @field_validator('expression')
    @classmethod
    def validate_expression(cls, v):
        if not v or not v.strip():
            raise ValueError('表达式不能为空')
        # 检查危险字符
        dangerous = ['__', 'import', 'eval', 'exec', 'open']
        if any(d in v.lower() for d in dangerous):
            raise ValueError('表达式包含非法字符')
        return v.strip()

class CalculateResponse(BaseModel):
    """计算响应"""
    success: bool = Field(..., description="是否成功")
    result: Optional[str] = Field(None, description="计算结果")
    expression: str = Field(..., description="原始表达式")
    formatted_expression: Optional[str] = Field(None, description="格式化表达式")
    error: Optional[str] = Field(None, description="错误信息")
    computation_time_ms: float = Field(..., description="计算耗时(毫秒)")

class FunctionInfo(BaseModel):
    """函数信息"""
    name: str
    description: str
    syntax: str
    example: str
    category: str

class HealthResponse(BaseModel):
    """健康检查响应"""
    status: str
    version: str
    timestamp: float

