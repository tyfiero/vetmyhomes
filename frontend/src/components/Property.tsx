interface PropertyProps {
	address: string;
}

export default function PropertyList({ properties }: PropertyProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{properties.map((property) => (
				<Property key={property.id} {...property} />
			))}
		</div>
	);
}

function Property({ property }: PropertyProps) {
	return (
		<div className="rounded-lg border border-border bg-card p-4 hover:shadow-lg transition-shadow">
			<h3 className="text-lg font-semibold text-foreground mb-2">
				{property.address}
			</h3>

			<div className="text-xl font-bold text-primary mb-4">
				${property.price.toLocaleString()}
			</div>

			<div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
				<div className="flex items-center gap-1">
					<span>{property.bedrooms}</span>
					<span>Beds</span>
				</div>
				<div className="flex items-center gap-1">
					<span>{property.bathrooms}</span>
					<span>Baths</span>
				</div>
				<div className="flex items-center gap-1">
					<span>{property.squareFeet.toLocaleString()}</span>
					<span>Sq Ft</span>
				</div>
			</div>
		</div>
	);
}
