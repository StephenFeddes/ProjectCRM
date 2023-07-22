function LinkedTableCell({ linkPath, linkName }) {
	return (
		<td className="dependent-table-cell">
			<Link className="dependent-table-cell-link" to={linkPath}>
				{linkName}
			</Link>
		</td>
	);
}

export default LinkedTableCell;
