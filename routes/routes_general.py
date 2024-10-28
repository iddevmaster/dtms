
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy import asc, or_, desc
from sqlalchemy.orm import Session
from authen import auth_request
from database import get_db
from function import todaytime, rows_limit, ternaryZero, ceil
from models import VehicleData, LocationThai
from schemas_format.general_schemas import ResponseProcess, ResponseData, FilterRequestSchema, VehicleDataRequestInSchema, VehicleDataRequestOutSchema


routes_general = APIRouter()

# Main Method


@routes_general.post("/vehicle/create", response_model=VehicleDataRequestOutSchema)
async def create_vehicle(request: VehicleDataRequestInSchema, db: Session = Depends(get_db), authenticated: bool = Depends(auth_request)):
    _vehicle = VehicleData(
        vehicle_brand=request.vehicle_brand,
        vehicle_license_plate=request.vehicle_license_plate,
        vehicle_use_date=request.vehicle_use_date,
        vehicle_expiry=request.vehicle_expiry,
        vehicle_cover=request.vehicle_cover,
        vehicle_description=request.vehicle_description,
        vehicle_type_id=request.vehicle_type_id,
        active=request.active,
        create_date=todaytime(),
        update_date=todaytime(),
        province_code=request.province_code,
        branch_id=request.branch_id,
        school_id=request.school_id
    )
    db.add(_vehicle)
    db.commit()
    db.refresh(_vehicle)
    return _vehicle


@routes_general.put("/vehicle/{vehicle_id}", response_model=VehicleDataRequestOutSchema)
def update_vehicle(vehicle_id: int, request: VehicleDataRequestInSchema,  db: Session = Depends(get_db), authenticated: bool = Depends(auth_request)):
    _vehicle = db.query(VehicleData).filter(
        VehicleData.vehicle_id == vehicle_id).one_or_none()
    if not _vehicle:
        raise HTTPException(status_code=404, detail="Data not found")
    _vehicle.vehicle_brand = request.vehicle_brand
    _vehicle.vehicle_license_plate = request.vehicle_license_plate
    _vehicle.vehicle_use_date = request.vehicle_use_date
    _vehicle.vehicle_expiry = request.vehicle_expiry
    _vehicle.vehicle_cover = request.vehicle_cover
    _vehicle.vehicle_description = request.vehicle_description
    _vehicle.vehicle_type_id = request.vehicle_type_id
    _vehicle.active = request.active
    _vehicle.update_date = todaytime()
    _vehicle.province_code = request.province_code
    _vehicle.branch_id = request.branch_id
    _vehicle.school_id = request.school_id

    db.commit()
    db.refresh(_vehicle)
    db.refresh(_vehicle)
    return _vehicle


@routes_general.delete("/vehicle/{vehicle_id}")
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db), authenticated: bool = Depends(auth_request)):
    _vehicle = db.query(VehicleData).filter(
        VehicleData.vehicle_id == vehicle_id).one_or_none()
    if not _vehicle:
        raise HTTPException(status_code=404, detail="Data not found")
    _vehicle.cancelled = 0
    db.commit()
    return ResponseProcess(status="success", status_code="200", message="Success delete data")


@routes_general.get("/vehicle/{vehicle_id}", response_model=VehicleDataRequestOutSchema)
def get_by_vehicle_id(vehicle_id: int, db: Session = Depends(get_db), authenticated: bool = Depends(auth_request)):
    _vehicle = db.query(VehicleData).filter(
        VehicleData.vehicle_id == vehicle_id).one_or_none()
    if not _vehicle:
        raise HTTPException(status_code=404, detail="Data not found")
    return _vehicle

# .join(LocationThai, LocationThai.province_code == LocationThai.province_code)


@routes_general.post("/vehicle/{school_id}/all")
def get_vehicle(request: FilterRequestSchema, school_id: str, branch_id: str = "all",  db: Session = Depends(get_db),  authenticated: bool = Depends(auth_request)):
    skip = ternaryZero(((request.page - 1) * request.per_page))
    limit = rows_limit(request.per_page)
    search_value = request.search_value
    result = db.query(VehicleData).order_by(
        desc(VehicleData.vehicle_id)).filter(VehicleData.cancelled == 1)
    total_data = result.count()
    if branch_id != 'all':
        # โชว์เฉพาะสาขาตนเอง
        result = result.filter(VehicleData.branch_id == branch_id)
    else:
        result = result.filter(VehicleData.school_id == school_id)

    if search_value:
        _province = db.query(LocationThai.province_code).filter(
            LocationThai.province_name.contains(search_value)).first()
        if _province is not None:
            result = result.filter(VehicleData.province_code == _province[0])
        else:
            result = result.filter(or_(VehicleData.vehicle_brand.contains(search_value), VehicleData.vehicle_license_plate.contains(
                search_value), VehicleData.vehicle_description.contains(search_value)))

    total_filter_data = result.count()
    result = result.offset(skip).limit(limit).all()
    total_page = ceil(total_data / request.per_page)
    content = [VehicleDataRequestOutSchema.from_orm(p) for p in result]
    return ResponseData(status="success", status_code="200", message="Success fetch all data", page=request.page, per_page=limit, total_page=total_page, total_data=total_data, total_filter_data=total_filter_data, data=content)
