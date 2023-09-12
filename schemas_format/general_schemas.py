from datetime import date, datetime, time
from typing import Generic, Optional, TypeVar, List
from pydantic.generics import GenericModel
from pydantic import BaseModel
from schemas_format.master_data_schemas import ProvinceRequestOutSchema
from schemas_format.school_schemas import BranchRequestOutSchema
T = TypeVar('T')


class ResponseProcess(GenericModel, Generic[T]):
    status: str
    status_code: str
    message: str


class ResponseData(GenericModel, Generic[T]):
    status: str
    status_code: str
    message: str
    page: int
    per_page: int
    total_page: int
    total_data: int
    total_filter_data: int
    data: List


class FilterRequestSchema(GenericModel, Generic[T]):
    page: Optional[int] = 1
    per_page: Optional[int] = 100
    search_value: Optional[str] = ""


class fullcalendarTypeAOutSchema(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = None
    start: Optional[datetime] = None
    end: Optional[datetime] = None
    editable: Optional[bool] = None
    backgroundColor: Optional[str] = None

    class Config:
        orm_mode = True


class fullcalendarTypeBOutSchema(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = None
    start: Optional[date] = None
    end: Optional[date] = None
    backgroundColor: Optional[str] = None

    class Config:
        orm_mode = True


class VehicleDataRequestInSchema(BaseModel):
    vehicle_brand: Optional[str] = None
    vehicle_license_plate: Optional[str] = None
    vehicle_use_date: Optional[date] = None
    vehicle_expiry: Optional[date] = None
    vehicle_cover: Optional[str] = None
    vehicle_description: Optional[str] = None
    vehicle_type_id: Optional[int] = None
    active: Optional[int] = None
    province_code: Optional[str] = None
    branch_id: Optional[str] = None
    school_id: Optional[str] = None

    class Config:
        orm_mode = True


class VehicleDataRequestOutSchema(BaseModel):
    vehicle_id: Optional[int] = None
    vehicle_brand: Optional[str] = None
    vehicle_license_plate: Optional[str] = None
    vehicle_use_date: Optional[date] = None
    vehicle_expiry: Optional[date] = None
    vehicle_cover: Optional[str] = None
    vehicle_description: Optional[str] = None
    vehicle_type_id: Optional[int] = None
    active: Optional[int] = None
    cancelled: Optional[int] = None
    create_date: Optional[datetime] = None
    update_date: Optional[datetime] = None
    province_code: Optional[str] = None
    branch_id: Optional[str] = None
    school_id: Optional[str] = None
    province_vehicle: ProvinceRequestOutSchema
    branch_vehicle: BranchRequestOutSchema

    class Config:
        orm_mode = True
