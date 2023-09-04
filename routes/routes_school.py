from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc, or_
from sqlalchemy.orm import Session

from authen import auth_request
from database import get_db
from function import ceil, ternaryZero, todaytime, rows_limit
from models import Branch, School

from schemas_format.general_schemas import FilterRequestSchema, ResponseData,  ResponseProcess
from schemas_format.school_schemas import BranchRequestInSchema, BranchRequestOutSchema, SchoolRequestInSchema, SchoolRequestOutSchema
router_school = APIRouter()


@router_school.post("/create", response_model=SchoolRequestOutSchema)
async def create_school(request: SchoolRequestInSchema, db: Session = Depends(get_db), authenticated: bool = Depends(auth_request)):
    _school = School(
        school_name=request.school_name,
        school_description=request.school_description,
        school_address=request.school_address,
        school_phone=request.school_phone,
        school_email=request.school_email,
        school_tax=request.school_tax,
        school_branch_amount=request.school_branch_amount,
        school_cover=request.school_cover,
        location_id=request.location_id,
        active=request.active,
        create_date=todaytime(),
        update_date=todaytime()
    )
    db.add(_school)
    db.commit()
    db.refresh(_school)
    school_id = _school.school_id
    # สร้างสาขาขึ้นมา 1 สาขา
    _branch = Branch(
        branch_code="0",
        branch_name="สำนักงานใหญ่",
        active=1,
        create_date=todaytime(),
        update_date=todaytime(),
        school_id=school_id
    )
    db.add(_branch)
    db.commit()
    return _school


@router_school.put("/{school_id}", response_model=SchoolRequestOutSchema)
async def update_school(school_id: str, request: SchoolRequestInSchema, db: Session = Depends(get_db), authenticated: bool = Depends(auth_request)):
    _school = db.query(School).filter(
        School.school_id == school_id).one_or_none()
    if not _school:
        raise HTTPException(status_code=404, detail="Data not found")
    _school.school_name = request.school_name
    _school.school_description = request.school_description
    _school.school_address = request.school_address
    _school.school_phone = request.school_phone
    _school.school_email = request.school_email
    _school.school_tax = request.school_tax
    _school.school_branch_amount = request.school_branch_amount
    _school.school_cover = request.school_cover
    _school.location_id = request.location_id
    _school.active = request.active
    _school.update_date = todaytime()

    db.commit()
    db.refresh(_school)
    return _school


@router_school.get("/{school_id}", response_model=SchoolRequestOutSchema)
async def get_by_school_id(school_id: str,  db: Session = Depends(get_db), authenticated: bool = Depends(auth_request)):
    _school = db.query(School).filter(
        School.school_id == school_id).one_or_none()
    if not _school:
        raise HTTPException(status_code=404, detail="Data not found")
    return _school


@router_school.post("/all")
async def get_school(request: FilterRequestSchema, db: Session = Depends(get_db),  authenticated: bool = Depends(auth_request)):
    skip = ternaryZero(((request.page - 1) * request.per_page))
    limit = rows_limit(request.per_page)
    search_value = request.search_value
    result = db.query(School).filter(School.cancelled == 1)
    total_data = result.count()
    if search_value:
        result = result.filter(or_(School.school_name.contains(search_value), School.school_description.contains(
            search_value), School.school_address.contains(search_value), School.school_phone.contains(search_value), School.school_tax.contains(search_value)))

    total_filter_data = result.count()
    result = result.offset(skip).limit(limit).all()
    total_page = ceil(total_data / request.per_page)
    content = [SchoolRequestOutSchema.from_orm(p) for p in result]
    return ResponseData(status="success", status_code="200", message="Success fetch all data", page=request.page, per_page=limit, total_page=total_page, total_data=total_data, total_filter_data=total_filter_data, data=content)


@router_school.delete("/{school_id}")
async def delete_school(school_id: str, db: Session = Depends(get_db), authenticated: bool = Depends(auth_request)):
    _school = db.query(School).filter(
        School.school_id == school_id).one_or_none()
    if not _school:
        raise HTTPException(status_code=404, detail="Data not found")
    _school.cancelled = 0
    # db.delete(_school)
    db.commit()
    db.refresh(_school)
    return ResponseProcess(status="success", status_code="200", message="Success delete data")


@router_school.post("/branch/create", response_model=BranchRequestOutSchema)
async def create_branch(request: BranchRequestInSchema, db: Session = Depends(get_db), authenticated: bool = Depends(auth_request)):
    _branch = Branch(
        branch_code=request.branch_code,
        branch_name=request.branch_name,
        branch_description=request.branch_description,
        branch_address=request.branch_address,
        branch_phone=request.branch_phone,
        branch_email=request.branch_email,
        active=request.active,
        create_date=todaytime(),
        update_date=todaytime(),
        location_id=request.location_id,
        school_id=request.school_id
    )
    db.add(_branch)
    db.commit()
    db.refresh(_branch)
    return _branch


@router_school.put("/branch/{branch_id}", response_model=BranchRequestOutSchema)
async def update_branch(branch_id: str, request: BranchRequestInSchema, db: Session = Depends(get_db), authenticated: bool = Depends(auth_request)):
    _branch = db.query(Branch).filter(
        Branch.branch_id == branch_id).one_or_none()
    if not _branch:
        raise HTTPException(status_code=404, detail="Data not found")
    _branch.branch_code = request.branch_code
    _branch.branch_name = request.branch_name
    _branch.branch_description = request.branch_description
    _branch.branch_address = request.branch_address
    _branch.branch_phone = request.branch_phone
    _branch.branch_email = request.branch_email
    _branch.active = request.active
    _branch.update_date = todaytime()
    _branch.location_id = request.location_id
    _branch.school_id = request.school_id
    db.commit()
    db.refresh(_branch)
    return _branch


@router_school.post("/branch/all/{school_id}")
async def get_branch(school_id: str, request: FilterRequestSchema, db: Session = Depends(get_db),  authenticated: bool = Depends(auth_request)):
    skip = ternaryZero(((request.page - 1) * request.per_page))
    limit = rows_limit(request.per_page)
    search_value = request.search_value

    result = db.query(Branch).order_by(desc(Branch.create_date)).filter(
        Branch.cancelled == 1, Branch.school_id == school_id)
    total_data = result.count()

    if search_value:
        result = result.filter(or_(Branch.branch_code.contains(
            search_value), Branch.branch_name.contains(search_value)))

    total_filter_data = result.count()
    result = result.offset(skip).limit(limit).all()
    total_page = ceil(total_data / request.per_page)
    content = [BranchRequestOutSchema.from_orm(p) for p in result]
    return ResponseData(status="success", status_code="200", message="Success fetch all data", page=request.page, per_page=limit, total_page=total_page, total_data=total_data, total_filter_data=total_filter_data, data=content)


@router_school.get("/branch/{branch_id}", response_model=BranchRequestOutSchema)
async def get_by_branch_id(branch_id: str,  db: Session = Depends(get_db), authenticated: bool = Depends(auth_request)):
    _branch = db.query(Branch).filter(
        Branch.branch_id == branch_id).one_or_none()
    if not _branch:
        raise HTTPException(status_code=404, detail="Data not found")
    return _branch


@router_school.delete("/branch/{branch_id}")
async def delete_branch(branch_id: int, db: Session = Depends(get_db), authenticated: bool = Depends(auth_request)):
    _branch = db.query(Branch).filter(
        Branch.branch_id == branch_id).one_or_none()
    if not _branch:
        raise HTTPException(status_code=404, detail="Data not found")
    _branch.cancelled = 0
    db.commit()
    return ResponseProcess(status="success", status_code="200", message="Success delete data")
