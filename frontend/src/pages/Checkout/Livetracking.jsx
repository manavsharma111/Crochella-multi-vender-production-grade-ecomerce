import { useEffect, useState } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"
// Fixes markers not appearing
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// Custom Styles for markers
const deliveryBoyIcon = new L.divIcon({
  className: "custom-div-icon",
  html: `<div style="width: 20px; height: 20px; background-color: #ff007f; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px #ff007f;"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
})

const userHomeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Helper component to automatically auto-center map when coordinates change and fix grey tiles
const RecenterMap = ({ coords }) => {
  const map = useMap()

  useEffect(() => {
    // Fix for grey tiles when loading map inside a modal
    setTimeout(() => {
      map.invalidateSize()
    }, 100)
    setTimeout(() => {
      map.invalidateSize()
    }, 500)

    if (coords && coords.lat && coords.lng) {
      map.setView([coords.lat, coords.lng], 15, { animate: true })
    }
  }, [coords, map])

  return null
}

const LiveTrackingMap = ({ deliveryBoy, user, deliveryCoords, userCoords }) => {
  const [route, setRoute] = useState([])

  // Backwards compatibility with the different prop shapes you were testing
  const dCoords = deliveryCoords || deliveryBoy?.location
  const uCoords = userCoords || user?.address

  useEffect(() => {
    const calculateRoute = async () => {
      if (!uCoords?.lat || !dCoords?.lat) return

      // OSRM expects longitude,latitude
      const origin = `${uCoords.lng},${uCoords.lat}`
      const destination = `${dCoords.lng},${dCoords.lat}`

      try {
        // Free OSRM routing API
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${origin};${destination}?overview=full&geometries=geojson`,
        )
        const data = await res.json()

        if (data.routes && data.routes.length > 0) {
          // GeoJSON uses [lng, lat], but leaflet Polyline needs [lat, lng]
          const coordinates = data.routes[0].geometry.coordinates.map(
            (coord) => [coord[1], coord[0]],
          )
          setRoute(coordinates)
        }
      } catch (e) {
        console.log("Error calculating route:", e.message)
      }
    }

    calculateRoute()
  }, [dCoords, uCoords])

  const formatTime = (seconds) => {
    if (seconds === 0) return "0:00"
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return h > 0
      ? `${h}:${m.toString().padStart(2, "0")}`
      : `${m}:${s.toString().padStart(2, "0")}`
  }

  // Default fallback coordinates (e.g., Delhi/NCR or central location)
  const defaultCenter = [28.6139, 77.209]
  const center = dCoords?.lat ? [dCoords.lat, dCoords.lng] : defaultCenter

  return (
    <div className="w-full h-full min-h-[200px] rounded-3xl overflow-hidden border-2 border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative z-10">
      <MapContainer
        center={center}
        zoom={15}
        className="w-full h-full"
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Premium Dark Mode Map Layer
        />

        {/* Delivery Boy Marker */}
        {dCoords?.lat && (
          <Marker position={[dCoords.lat, dCoords.lng]} icon={deliveryBoyIcon}>
            <Popup>
              <span className="font-bold text-black">Delivery Partner</span>
            </Popup>
          </Marker>
        )}

        {/* User/Customer Destination Marker */}
        {uCoords?.lat && (
          <Marker position={[uCoords.lat, uCoords.lng]} icon={userHomeIcon}>
            <Popup>
              <span className="font-bold text-black">
                Your Delivery Address
              </span>
            </Popup>
          </Marker>
        )}

        {/* Route Polyline */}
        {route.length > 0 && (
          <Polyline
            positions={route}
            color="#ff007f"
            weight={5}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}

        <RecenterMap coords={dCoords} />
      </MapContainer>
    </div>
  )
}

export default LiveTrackingMap
