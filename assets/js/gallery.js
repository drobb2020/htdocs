// Specify the directory path where your photos are located
const photoDirectory = 'path/to/photos'

// Get a reference to the gallery container element
const galleryContainer = document.getElementById('gallery')

// Function to fetch the list of photos from the subdirectory
async function fetchPhotos() {
  try {
    const response = await fetch(photoDirectory)
    const html = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const photoLinks = doc.querySelectorAll('a')

    // Iterate over the photo links and create gallery elements
    photoLinks.forEach(link => {
      const photoUrl = link.href

      // Create a new image element for each photo
      const image = document.createElement('img')
      image.src = photoUrl

      // Append the image element to the gallery container
      galleryContainer.appendChild(image)
    })
  } catch (error) {
    console.error('Error fetching photos:', error)
  }
}

// Call the fetchPhotos function to populate the gallery
fetchPhotos()
