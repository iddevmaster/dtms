from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel

# User


class SchoolRequestInSchema(BaseModel):
    school_name: Optional[str] = None
    school_description: Optional[str] = None
    school_address: Optional[str] = None
    school_phone: Optional[str] = None
    school_email: Optional[str] = None
    school_tax: Optional[str] = None
    school_branch_amount: Optional[int] = None
    school_cover: Optional[str] = None
    location_id: Optional[int] = None
    active: Optional[int] = None

    class Config:
        orm_mode = True


class SchoolRequestOutSchema(BaseModel):
    school_id: Optional[str] = None
    school_name: Optional[str] = None
    school_description: Optional[str] = None
    school_address: Optional[str] = None
    school_phone: Optional[str] = None
    school_email: Optional[str] = None
    school_tax: Optional[str] = None
    school_branch_amount: Optional[int] = None
    school_cover: Optional[str] = None
    location_id: Optional[int] = None
    active: Optional[int] = None
    create_date: Optional[datetime] = None
    update_date: Optional[datetime] = None
    location_school:  Optional[object] = None

    class Config:
        orm_mode = True


class BranchRequestInSchema(BaseModel):
    branch_code: Optional[str] = None
    branch_name: Optional[str] = None
    branch_description: Optional[str] = None
    branch_address: Optional[str] = None
    branch_phone: Optional[str] = None
    branch_email: Optional[str] = None
    active: Optional[int] = None
    location_id: Optional[int] = None
    school_id: Optional[str] = None

    class Config:
        orm_mode = True


class BranchRequestOutSchema(BaseModel):
    branch_id: Optional[str] = None
    branch_code: Optional[str] = None
    branch_name: Optional[str] = None
    branch_description: Optional[str] = None
    branch_address: Optional[str] = None
    branch_phone: Optional[str] = None
    branch_email: Optional[str] = None
    active: Optional[int] = None
    create_date: Optional[datetime] = None
    update_date: Optional[datetime] = None
    location_id: Optional[int] = None
    school_id: Optional[str] = None
    location_branch: object

    class Config:
        orm_mode = True


class CompanyRequestInSchema(BaseModel):
    company_name: Optional[str] = None
    company_tax: Optional[str] = None
    company_description: Optional[str] = None
    company_address: Optional[str] = None
    company_phone: Optional[str] = None
    company_email: Optional[str] = None
    company_cover: Optional[str] = None
    active: Optional[int] = None
    location_id: Optional[int] = None
    school_id: Optional[str] = None

    class Config:
        orm_mode = True


class CompanyRequestOutSchema(BaseModel):
    company_id: Optional[str] = None
    company_name: Optional[str] = None
    company_tax: Optional[str] = None
    company_description: Optional[str] = None
    company_address: Optional[str] = None
    company_phone: Optional[str] = None
    company_email: Optional[str] = None
    company_cover: Optional[str] = None
    active: Optional[int] = None
    location_id: Optional[int] = None
    school_id: Optional[str] = None
    location_company: object

    class Config:
        orm_mode = True
