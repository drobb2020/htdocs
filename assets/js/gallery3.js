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
          console.log(photoUrls)
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
    photoGallery.appendChild(photo)
    // console.log(photo.src)
  })
}

// Fetch photos from subfolders and display them
const parentFolder = '../../photogallery/'
const subfolders = ['2019-2020', '2020-2021', '2021-2022', '2022-2023']

const fetchPromises = subfolders.map(subfolder => {
  const folderPath = parentFolder + subfolder + '/'
  return getPhotosFromFolder(folderPath).then(photoUrls => {
    const subSubfolderPromises = photoUrls.map(photoUrl => {
      const subSubfolderPath = photoUrl.substring(
        photoUrl.indexOf(subfolder) + subfolder.length + 1,
        photoUrl.lastIndexOf('/')
      )
      return getPhotosFromFolder(parentFolder + subSubfolderPath + '/').then(
        subSubfolderPhotoUrls => {
          return subSubfolderPhotoUrls.map(
            subSubfolderPhotoUrl =>
              parentFolder + subSubfolderPath + '/' + subSubfolderPhotoUrl
          )
        }
      )
    })
    return Promise.all(subSubfolderPromises).then(results => results.flat())
  })
})

Promise.all(fetchPromises)
  .then(results => {
    const photoUrls = results.flat()
    displayPhotos(photoUrls)
  })
  .catch(error => {
    console.error('Error fetching photos:', error)
  })
