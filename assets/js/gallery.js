// Function to recursively fetch all photo files in subfolders
function getPhotosFromFolder(folderPath) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', folderPath, true)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const html = new DOMParser().parseFromString(
            xhr.responseText,
            'text/html'
          )
          const imageElements = html.querySelectorAll(
            'a[href$=".jpg"], a[href$=".png"], a[href$=".jpeg"]'
          )
          const photoUrls = Array.from(imageElements).map(
            element => element.href
          )
          resolve(photoUrls)
        } else {
          reject(xhr.status)
        }
      }
    }
    xhr.send()
  })
}

// Function to display the photos in the gallery
function displayPhotos(photoUrls) {
  const photoGallery = document.getElementById('photoGallery')
  photoUrls.forEach(url => {
    const photo = document.createElement('img')
    photo.src = url
    photo.className = 'photo'

    photo.addEventListener('click', () => {
      // popup stuff
      popup.style.transform = 'translateY(0)'
      selectedImage.src = url
      selectedImage.alt = '2nd Russell Scouting image'
    })

    photoGallery.appendChild(photo)
  })
}

// Fetch photos from subfolders and display them
const parentFolder = '../../photogallery/'
const subfolders = ['2019-2020', '2020-2021', '2021-2022', '2022-2023',]

const fetchPromises = subfolders.map(subfolder => {
  const folderPath = parentFolder + subfolder + '/'
  return getPhotosFromFolder(folderPath)
})

Promise.all(fetchPromises)
  .then(results => {
    const photoUrls = results.flat()
    displayPhotos(photoUrls)
  })
  .catch(error => {
    console.error('Error fetching photos:', error)
  })

popup.addEventListener('click', () => {
  popup.style.transform = `translateY(-100%)`
  popup.src = ''
  popup.alt = ''
})
