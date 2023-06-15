import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { Center, Spinner } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppState, mapStateActions } from "../../store/store";
import { Airport } from "../../pages/api/interfaces";

function UpdateMapState() {
  const dispatch = useDispatch();

  const map = useMapEvents({
    moveend() {
      dispatch(
        mapStateActions.setState({
          lat: map.getCenter().lat,
          lon: map.getCenter().lng,
          zoom: map.getZoom(),
        })
      );
    },
  });

  return null;
}
const airportIcon = L.icon({
  iconUrl: "/airport.svg",
  iconSize: [36, 36],
  popupAnchor: [0, -15],
});

const Map = ({
  loading,
  destinations,
}: {
  loading: boolean;
  destinations: { from: string; airports: any[] };
}) => {
  const mapState = useSelector((state: AppState) => state.mapState);

  return (
    <>
      {loading ? (
        <Center marginTop={"10%"}>
          <Spinner
            size={"xl"}
            thickness="4px"
            color="#D90368"
            emptyColor="#F1E9DA"
          />
        </Center>
      ) : (
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          center={[mapState.lat, mapState.lon]}
          zoom={mapState.zoom}
        >
          <UpdateMapState />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {destinations.airports.map((airport: Airport) => (
            <Marker
              key={airport.ident}
              icon={airportIcon}
              position={[airport.latitude_deg, airport.longitude_deg]}
            >
              <Popup>{airport.ident}</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </>
  );
};

export default Map;
