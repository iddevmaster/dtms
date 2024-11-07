import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import Functions from "../../functions";

const Bill = ({ rs }) => {
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  return (
    <div>
      <div ref={printRef}>
        <Card>
          <Card.Body>
            <div align="center">
              <h4>เลขที่ใบเสร็จ {rs.pr_number}</h4>
            </div>

            <Table>
              <tbody>
                <tr>
                  <th>วันที่ออกใบเสร็จ</th>
                  <td>{Functions.format_date_time(rs.create_date)}</td>
                </tr>
                <tr>
                  <th>ชื่อ</th>
                  <td>{rs.pr_name}</td>
                </tr>
                <tr>
                  <th>เลขที่เสียภาษี</th>
                  <td>{rs.pr_tax_number}</td>
                </tr>
                <tr>
                  <th>ที่อยู่</th>
                  <td>{rs.pr_address}</td>
                </tr>
                <tr>
                  <th>ผู้ออกใบเสร็จ</th>
                  <td>{rs.pr_receipt_issuer}</td>
                </tr>
              </tbody>
            </Table>

            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>รายการ</th>
                  <th>หน่วย</th>
                  <th>ราคาต่อหน่วย</th>
                  <th>จำนวนเงิน(บาท)</th>
                </tr>
              </thead>
              <tbody>
                {rs.payment_child.map((rs2, index) => (
                  <tr key={index}>
                    <td>{rs2.pl_name}</td>
                    <td align="right">{rs2.pl_unit}</td>
                    <td align="right">{rs2.pl_price_per_unit}</td>
                    <td align="right">
                      {Functions.formatnumberWithcomma(rs2.pl_price_sum)}
                    </td>
                  </tr>
                ))}
                <tr align="right">
                  <td colSpan={3}>ส่วนลด (%)</td>
                  <td>{rs.pr_discount_percent}</td>
                </tr>
                <tr align="right">
                  <td colSpan={3}>เป็นจำนวนเงิน</td>
                  <td>
                    {Functions.formatnumberWithcomma(rs.pr_discount_amount)}
                  </td>
                </tr>
                <tr align="right">
                  <td colSpan={3}>รวมค่าชำระสุทธิ</td>
                  <td>{Functions.formatnumberWithcomma(rs.pr_total_amount)}</td>
                </tr>
                <tr align="right">
                  <td colSpan={3}>
                    <strong>จำนวนเงินที่ชำระ</strong>
                  </td>
                  <td>{Functions.formatnumberWithcomma(rs.pr_pay)}</td>
                </tr>
                <tr align="right">
                  <td colSpan={3}>ยอดค้างชำระ</td>
                  <td>{Functions.formatnumberWithcomma(rs.pr_debt)}</td>
                </tr>
              </tbody>
            </Table>
            <p>หมายเหตุ : {rs.pr_remark}</p>
            <p>รหัสใบเสร็จ : {rs.pr_id}</p>
          </Card.Body>
        </Card>
      </div>
      <button className="btn btn-info w-100" onClick={handlePrint}>
        Print
      </button>
    </div>
  );
};

export default Bill;
