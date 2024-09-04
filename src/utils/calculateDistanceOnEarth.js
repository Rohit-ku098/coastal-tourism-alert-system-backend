// Haversine formula to calculate the distance between two points on the Earth's surface
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance;
}

// Function to determine if a location is impacted by the tsunami
function isImpactedByTsunami(
  epicenterLat,
  epicenterLon,
  locationLat,
  locationLon,
  magnitude
) {
  // Estimate impact radius based on magnitude (this is a simplified approach)
  // You can adjust these values based on more precise data or formulas
  let impactRadius = 0;

  if (magnitude >= 9) {
    impactRadius = 2000; // Example: 2000 km for very high magnitude
  } else if (magnitude >= 8) {
    impactRadius = 1000;
  } else if (magnitude >= 7) {
    impactRadius = 500;
  } else if (magnitude >= 6) {
    impactRadius = 200;
  } else if (magnitude >= 5) {
    impactRadius = 100;
  } else if (magnitude >= 4) {
    impactRadius = 50;
  } else if (magnitude >= 3) {
    impactRadius = 10;
  } else {
    impactRadius = 0; // Tsunamis are unlikely to have significant impact below magnitude 3
  }

  // Calculate distance from epicenter to the location
  const distance = haversineDistance(
    epicenterLat,
    epicenterLon,
    locationLat,
    locationLon
  );

  // Check if the distance is within the impact radius
  return distance <= impactRadius;
}

// Example usage
const epicenterLat = -6.79; // Example epicenter latitude
const epicenterLon = 155.52; // Example epicenter longitude
const locationLat = 14.5; // Example location latitude
const locationLon = 120.5; // Example location longitude
const magnitude = 6.5; // Example tsunami magnitude

if (
  isImpactedByTsunami(
    epicenterLat,
    epicenterLon,
    locationLat,
    locationLon,
    magnitude
  )
) {
  console.log("The location is within the impacted region of the tsunami.");
} else {
  console.log("The location is outside the impacted region of the tsunami.");
}
