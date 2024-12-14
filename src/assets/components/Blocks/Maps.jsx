import L from 'leaflet'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import React from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
	iconRetinaUrl,
	iconUrl,
	shadowUrl,
})
function Map({ exhibitions }) {
	const defaultPosition = [50, 10]
	const defaultZoom = 4

	return (
		<MapContainer
			center={defaultPosition}
			zoom={defaultZoom}
			style={{ height: '500px', width: '100%' }}
		>
			<TileLayer
				attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{exhibitions.map((ex) => {
				if (!ex.latitude || !ex.longitude) return null
				const position = [
					parseFloat(ex.latitude),
					parseFloat(ex.longitude),
				]
				return (
					<Marker key={ex.id} position={position}>
						<Popup>
							<p>{ex.title_en || ex.title_uk || 'Виставка'}</p>
							<p>
								{ex.address || ex.location_en || ex.location_uk}
							</p>
						</Popup>
					</Marker>
				)
			})}
		</MapContainer>
	)
}
export default Map
