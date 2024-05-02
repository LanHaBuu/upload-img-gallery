import { useEffect, useRef, useState } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  getMetadata,
} from "firebase/storage";
import { storage } from "./firebase";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import webpfy from "webpfy";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { getFileName } from "./service";
import { fsImage } from "./firestore";
import useSWR from "swr";
import { Button} from 'antd';
import {  LoadingOutlined, UploadOutlined } from '@ant-design/icons';
function App() {

  const [imageUpload, setImageUpload] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(false);

  const imagesListRef = ref(storage, "images/");
  const fileInputRef = useRef<any>(null);

  const onChooseFile = () => {
    fileInputRef.current.value = null;
    fileInputRef.current.click();
  };

  const handleUploadImage = async () => {
    if (!imageUpload) return;

    const originalQuality = 10;
    const thumbQuality = 5;

    imageUpload[0]?.forEach(async (file: any) => {
      const options = {
        image: file,
        quality: originalQuality,
      };

      const thumbOptions = {
        image: file,
        quality: thumbQuality,
      };

      try {
        setIsLoading(true)
        const webp = await webpfy(options);
        const thumbWebp = await webpfy(thumbOptions);

        const convertedFileName = getFileName(file, webp);
        const convertedThumbFileName = getFileName(file, thumbWebp);

        const imageRef = ref(storage, `images/${convertedFileName}`);
        const imageThumbRef = ref(
          storage,
          `thumb-images/${convertedThumbFileName}`
        );

        const thumbSnapshot = await uploadBytes(
          imageThumbRef,
          thumbWebp.webpBlob
        );
        const thumbUrl = await getDownloadURL(thumbSnapshot.ref);

        const snapshot = await uploadBytes(imageRef, webp.webpBlob);
        const url = await getDownloadURL(snapshot.ref);

        await fsImage.create({
          originalUrl: url,
          thumbUrl,
        });
        mutate();
        setImageUpload([])
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        console.error("Error uploading image:", error);
      }
    });
  };

  const handleChooseImage = (e: any) => {
    setImageUpload((prev:any) => [Array.from(e.target.files)]);
  };

  const handleRemoveImage = (item:any) => {
    const itemFilter = imageUpload[0]?.filter((_:any) =>{
      return  _ != item
    })
    setImageUpload([itemFilter])
  }

  const { data, mutate } = useSWR("IMAGE_FETCHER", fsImage.getAll);

  console.log('sss',data);
  

  return (
    <div className="App">
      <div className="wrapper">
        <div className="header">
          <h2>Image Gallery</h2>
        </div>
        <div className="upload-btn">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleChooseImage}
            multiple
            hidden={true}
          />
    
          {imageUpload[0]?.length>0 ? (
            <Button type="primary" size={'large'}  icon={isLoading ? <LoadingOutlined /> : <UploadOutlined />} onClick={handleUploadImage}>
              Upload
            </Button>
          ) : (
            <Button type="primary" size={'large'}  icon={<UploadOutlined />} onClick={onChooseFile}>
            Choose Image
          </Button>
          )}
          <div className="img-seen-wrapper">
            {imageUpload[0]?.map((item:any,index:any) => {
              
               const imageUrl = URL.createObjectURL(item);
              return (
                (
                  <div className="img-seen-container">
                     <div 
                        key={index}
                        className="remove-icon"
                        onClick={() => handleRemoveImage(item)}>
                         x
                         </div>
              
                    <img src={imageUrl} className="img-seen" key={index}/>
                  </div>
                 )
              )
            })}
          </div>
        </div>

        <div className="image-wrap">
          <PhotoProvider>
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1280: 4 }}
            >
              <Masonry columnsCount={4} gutter="25px">
                {data &&
                  data?.map((item: any) => (
                    <PhotoView src={item.originalUrl} key={item.id}>
                      <img
                        src={item.thumbUrl}
                        alt=""
                        className="main-img"
                        style={{ objectFit: "cover" }}
                      />
                    </PhotoView>
                  ))}
              </Masonry>
            </ResponsiveMasonry>
          </PhotoProvider>
        </div>
      </div>
    </div>
  );
}

export default App;
