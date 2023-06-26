function indexImagesInFolder(folderPath, imageExtensions) {
  const images = []

  function traverseFolder(directory) {
    const reader = directory.createReader()

    reader.readEntries(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isDirectory) {
          // Recursively traverse subfolders
          traverseFolder(entry)
        } else if (
          imageExtensions.includes(entry.name.split('.').pop().toLowerCase())
        ) {
          // Check if the file has an image extension
          images.push(entry.fullPath)
        }
      })
    })
  }

  return new Promise(function (resolve, reject) {
    const dirHandle = window['showDirectoryPicker']()

    dirHandle
      .then(function (directory) {
        traverseFolder(directory)
        resolve(images)
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

// Usage example
const folderPath = '../photogallery' // Empty string for root folder
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']

indexImagesInFolder(folderPath, imageExtensions)
  .then(function (images) {
    console.log(images)
  })
  .catch(function (error) {
    console.error(error)
  })
