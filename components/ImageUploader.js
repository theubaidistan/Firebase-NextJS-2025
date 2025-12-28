// import { useState } from 'react';
// import { auth, storage, STATE_CHANGED } from '@lib/firebase';
// import Loader from './Loader';

// // Uploads images to Firebase Storage
// export default function ImageUploader() {
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [downloadURL, setDownloadURL] = useState(null);

//   // Creates a Firebase Upload Task
//   const uploadFile = async (e) => {
//     // Get the file
//     const file = Array.from(e.target.files)[0];
//     const extension = file.type.split('/')[1];

//     // Makes reference to the storage bucket location
//     const ref = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
//     setUploading(true);

//     // Starts the upload
//     const task = ref.put(file);

//     // Listen to updates to upload task
//     task.on(STATE_CHANGED, (snapshot) => {
//       const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
//       setProgress(pct);
//     });

//     // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
//     task
//       .then((d) => ref.getDownloadURL())
//       .then((url) => {
//         setDownloadURL(url);
//         setUploading(false);
//       });
//   };

//   return (
//     <div className="box">
//       <Loader show={uploading} />
//       {uploading && <h3>{progress}%</h3>}

//       {!uploading && (
//         <>
//           <label className="btn">
//             📸 Upload Img
//             <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
//           </label>
//         </>
//       )}

//       {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}
//     </div>
//   );
// }
//*------------------------------------------------------------------------------------------------------------------------------------
import { useState } from "react";
import Loader from "./Loader";

export default function ImageUploader({ onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

  const [progress, setProgress] = useState(0);

  // const CLOUD_NAME = "dobkoncyi"; // replace with your Cloudinary cloud name
  // const UPLOAD_PRESET = "Article"; // replace with your unsigned preset

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      // Call parent callback with image URL
      onUpload && onUpload(data.secure_url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="box">
      {uploading && <h3>Uploading...</h3>}
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}
      {!uploading && (
        <label className="btn">
          📸 Upload Image
          <input type="file" onChange={uploadFile} accept="image/*" />
        </label>
      )}
      {downloadURL && (
        <code className="upload-snippet">{`![alt](${downloadURL})`}</code>
      )}
    </div>
  );
}
