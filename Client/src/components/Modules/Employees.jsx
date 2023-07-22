import { BsFillPersonFill } from 'react-icons/bs';
import "../../css/modules/employeeModule.css";
import "../../css/modules/moduleContainer.css";
import "../../css/modules/moduleTable.css";
import TableCell from '../Tables/TableCell.jsx';
import TableRow from '../Tables/TableRow.jsx';
import LinkedTableCell from '../Tables/LinkedTableCell.jsx';
import { useEffect, useState } from 'react';

function Employees() {
    
    const [pageSize, setPageSize] = useState(2);

    useEffect(() => {
        

    }, [pageSize]);

	return (
        <div className="module-container">
            <div className="employee-module">
                <div className="module-header">
                    <BsFillPersonFill />
                </div>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Email</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Stephen Feddes</td>
                            <td>Software Engineer</td>
                            <td>Software Engineering</td>
                            <td>sfeddes@outlook.com</td>
                            <td>+1 708-964-5875</td>
                        </tr>
                        <TableRow>
                            <td>2</td>
                            <TableCell cellValue="Brian Feddes" />
                            <td>
                                Network Engineer
                            </td>
                            <TableCell cellValue="Escalations" />
                            <TableCell cellValue="bfeddes@hotmail.com" />
                            <TableCell cellValue="+1 555-555-5555" />
                        </TableRow>
                    </tbody>
                </table>
            </div>
        </div>
	);
}

export default Employees;