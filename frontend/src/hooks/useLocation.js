import { ref, onMounted, onUnmounted } from 'vue'

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const branches = [
  {
    id: 'kl',
    state: 'W.P. Kuala Lumpur',
    name: 'ComfyHome KL City Centre',
    address: 'Lot 88, Jalan Bukit Bintang, 55100 Kuala Lumpur',
    lat: 3.1478,
    lng: 101.6953,
    hours: {
      Monday: '9:00 AM - 9:00 PM',
      Tuesday: '9:00 AM - 9:00 PM',
      Wednesday: '9:00 AM - 9:00 PM',
      Thursday: '9:00 AM - 9:00 PM',
      Friday: '9:00 AM - 9:00 PM',
      Saturday: '10:00 AM - 8:00 PM',
      Sunday: 'Closed',
    },
  },
  {
    id: 'selangor',
    state: 'Selangor',
    name: 'ComfyHome Shah Alam',
    address: 'No. 12, Persiaran Selangor, 40150 Shah Alam',
    lat: 3.0733,
    lng: 101.5185,
    hours: {
      Monday: '9:00 AM - 7:00 PM',
      Tuesday: 'Closed',
      Wednesday: '9:00 AM - 7:00 PM',
      Thursday: '9:00 AM - 7:00 PM',
      Friday: '9:00 AM - 7:00 PM',
      Saturday: '9:00 AM - 7:00 PM',
      Sunday: '10:00 AM - 6:00 PM',
    },
  },
  {
    id: 'penang',
    state: 'Pulau Pinang',
    name: 'ComfyHome Georgetown',
    address: '23 Lebuh Chulia, 10200 Georgetown, Penang',
    lat: 5.4141,
    lng: 100.3295,
    hours: {
      Monday: '10:00 AM - 8:00 PM',
      Tuesday: '10:00 AM - 8:00 PM',
      Wednesday: 'Closed',
      Thursday: '10:00 AM - 8:00 PM',
      Friday: '10:00 AM - 8:00 PM',
      Saturday: '10:00 AM - 8:00 PM',
      Sunday: '10:00 AM - 8:00 PM',
    },
  },
  {
    id: 'johor',
    state: 'Johor',
    name: 'ComfyHome Johor Bahru',
    address: '45 Jalan Wong Ah Fook, 80000 Johor Bahru',
    lat: 1.4927,
    lng: 103.7414,
    hours: {
      Monday: '9:00 AM - 8:00 PM',
      Tuesday: '9:00 AM - 8:00 PM',
      Wednesday: '9:00 AM - 8:00 PM',
      Thursday: '9:00 AM - 8:00 PM',
      Friday: '9:00 AM - 8:00 PM',
      Saturday: '10:00 AM - 7:00 PM',
      Sunday: '10:00 AM - 7:00 PM',
    },
  },
  {
    id: 'sarawak',
    state: 'Sarawak',
    name: 'ComfyHome Kuching',
    address: 'Lot 246, Jalan Tun Hussien, 93000 Kuching',
    lat: 1.5497,
    lng: 110.3627,
    hours: {
      Monday: '9:00 AM - 6:00 PM',
      Tuesday: '9:00 AM - 6:00 PM',
      Wednesday: '9:00 AM - 6:00 PM',
      Thursday: '9:00 AM - 6:00 PM',
      Friday: 'Closed',
      Saturday: '10:00 AM - 5:00 PM',
      Sunday: '10:00 AM - 5:00 PM',
    },
  },
  {
    id: 'pahang',
    state: 'Pahang',
    name: 'ComfyHome Kuantan',
    address: 'No. 5, Jalan Teluk Sisek, 25000 Kuantan',
    lat: 3.8077,
    lng: 103.326,
    hours: {
      Monday: '10:00 AM - 7:00 PM',
      Tuesday: '10:00 AM - 7:00 PM',
      Wednesday: '10:00 AM - 7:00 PM',
      Thursday: '10:00 AM - 7:00 PM',
      Friday: '10:00 AM - 7:00 PM',
      Saturday: '10:00 AM - 6:00 PM',
      Sunday: 'Closed',
    },
  },
]

export function useLocation() {
  const mapRef = ref(null)
  const activeModal = ref(null)
  const activeBranchId = ref(null)
  const mapError = ref(false)

  const cardRefs = {}

  let googleMap = null
  const markers = {}
  let hoverTimer = null
  let bounceTimer = null

  function makePinUrl(active) {
    const fill = active ? '#c62828' : '#e53935'
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
      '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="' +
      fill +
      '" stroke="white" stroke-width="1.6"/>' +
      '<circle cx="12" cy="9" r="2.8" fill="white"/>' +
      '</svg>'
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
  }

  function makeIcon(active = false) {
    const w = active ? 52 : 42
    const h = active ? 60 : 49
    return {
      url: makePinUrl(active),
      scaledSize: new window.google.maps.Size(w, h),
      anchor: new window.google.maps.Point(w / 2, h),
    }
  }

  function resetMarkers() {
    Object.values(markers).forEach((m) => {
      m.setAnimation(null)
      m.setIcon(makeIcon(false))
    })
  }

  function focusBranch(branch, scrollCard = false) {
    if (!googleMap) return
    clearTimeout(bounceTimer)
    resetMarkers()

    activeBranchId.value = branch.id

    googleMap.panTo({ lat: branch.lat, lng: branch.lng })
    googleMap.setZoom(14)

    const marker = markers[branch.id]
    if (!marker) return

    marker.setIcon(makeIcon(true))
    marker.setAnimation(window.google.maps.Animation.BOUNCE)
    bounceTimer = setTimeout(() => {
      marker.setAnimation(null)
      marker.setIcon(makeIcon(false))
    }, 1400)

    if (scrollCard) {
      cardRefs[branch.id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  function onCardMouseenter(branch) {
    clearTimeout(hoverTimer)
    hoverTimer = setTimeout(() => focusBranch(branch, false), 160)
  }

  function onCardMouseleave() {
    clearTimeout(hoverTimer)
  }

  function onCardClick(branch) {
    clearTimeout(hoverTimer)
    focusBranch(branch, false)
  }

  function openModal(branch) {
    activeModal.value = branch
  }

  function closeModal() {
    activeModal.value = null
  }

  function openGoogleMaps(branch) {
    const q = encodeURIComponent(branch.lat + ',' + branch.lng)
    window.open('https://www.google.com/maps/search/?api=1&query=' + q, '_blank', 'noopener,noreferrer')
  }

  function initMap() {
    if (!mapRef.value) return
    googleMap = new window.google.maps.Map(mapRef.value, {
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER,
      },
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#f8f3ec' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#f8f3ec' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#5c4a38' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9dce9' }] },
        { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#6b8fa6' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e8ddd0' }] },
        { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#d4c8b8' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#d4b896' }] },
        { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#c4a882' }] },
        { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#ede6da' }] },
        { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d4e8c2' }] },
        { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#c4b4a4' }] },
      ],
    })

    const bounds = new window.google.maps.LatLngBounds()
    branches.forEach((branch) => {
      const marker = new window.google.maps.Marker({
        position: { lat: branch.lat, lng: branch.lng },
        map: googleMap,
        title: branch.name,
        icon: makeIcon(false),
      })
      marker.addListener('click', () => focusBranch(branch, true))
      markers[branch.id] = marker
      bounds.extend({ lat: branch.lat, lng: branch.lng })
    })
    googleMap.fitBounds(bounds, 60)
  }

  onMounted(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      mapError.value = true
      return
    }
    if (window.google?.maps) {
      initMap()
      return
    }
    window.__comfyHomeMapInit = () => {
      delete window.__comfyHomeMapInit
      initMap()
    }
    const script = document.createElement('script')
    script.src =
      'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&callback=__comfyHomeMapInit'
    script.async = true
    script.defer = true
    script.onerror = () => {
      mapError.value = true
    }
    document.head.appendChild(script)
  })

  onUnmounted(() => {
    clearTimeout(hoverTimer)
    clearTimeout(bounceTimer)
    delete window.__comfyHomeMapInit
  })

  return {
    mapRef,
    activeModal,
    activeBranchId,
    mapError,
    cardRefs,
    onCardMouseenter,
    onCardMouseleave,
    onCardClick,
    openModal,
    closeModal,
    openGoogleMaps,
  }
}
