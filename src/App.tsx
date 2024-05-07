import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

import { Button } from "antd";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import { getAllImages, uploadImage } from "./api";

function App() {
  const [data, setData] = useState<any>([]);
  const [test, setTest] = useState<boolean>(false);
  const [imageUpload, setImageUpload] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<any>(false);
  const [windowWidth, setWindowWidth] = useState(0);

  const numberColumnResponsive = (value: any) => {
    let keys = Object.keys(objectResponse).map(Number);
    keys.sort((a, b) => a - b);

    if (value < keys[0]) {
      return objectResponse[keys[0]];
    }
    if (value > keys[keys.length - 1]) {
      return objectResponse[keys[keys.length - 1]];
    }
    for (let i = 0; i < keys.length - 1; i++) {
      if (value >= keys[i] && value <= keys[i + 1]) {
        return objectResponse[keys[i]];
      }
    }

    // If value is greater than the last key, return the value corresponding to the last key
    return objectResponse[keys[keys.length - 1]];
  };

  const GUTTER_MANSORY = 25;
  const PADDING_TAG_WRAPPER = 40;
  const objectResponse: any = { 350: 1, 750: 2, 900: 3, 1280: 4 };
  const widthGutter =
    GUTTER_MANSORY *
    (numberColumnResponsive(windowWidth + PADDING_TAG_WRAPPER) - 1);
  const widthThumbFirstRender = Math.floor(
    (windowWidth - widthGutter) /
      numberColumnResponsive(windowWidth + PADDING_TAG_WRAPPER)
  );

  const fileInputRef = useRef<any>(null);

  const onChooseFile = () => {
    fileInputRef.current.value = null;
    fileInputRef.current.click();
  };

  const handleUploadImage = async () => {
    if (!imageUpload) return;
    setIsLoading(true);

    // Map each file to a promise of upload operation
    const uploadPromises = imageUpload[0]?.map(async (file: any) => {
      const formData = new FormData();
      formData.append("file", file);
      await uploadImage(formData);
    });

    // Wait for all upload operations to complete
    await Promise.all(uploadPromises);

    // Once all uploads are complete
    setTest((prev: any) => !prev);
    setImageUpload([]);
    setIsLoading(false);
  };

  const handleChooseImage = (e: any) => {
    setImageUpload(() => [Array.from(e.target.files)]);
  };

  const handleRemoveImage = (item: any) => {
    const itemFilter = imageUpload[0]?.filter((_: any) => {
      return _ != item;
    });
    setImageUpload([itemFilter]);
  };

  useLayoutEffect(() => {
    const updateWindowDimensions = () => {
      const mainImgElement: any = document.getElementsByClassName("wrapper")[0];
      if (mainImgElement) {
        const width = mainImgElement.offsetWidth;
        setWindowWidth(Math.floor(width));
      }
    };

    // Call the function initially
    updateWindowDimensions();

    // Add event listener for window resize
    window.addEventListener("resize", updateWindowDimensions);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener("resize", updateWindowDimensions);
    };
  }, []); // Empty dependency array to run effect only once

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllImages();
      setData(res.data);
    };
    fetchData();
  }, [test]);

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

          {imageUpload[0]?.length > 0 ? (
            <Button
              type="primary"
              size={"large"}
              icon={isLoading ? <LoadingOutlined /> : <UploadOutlined />}
              onClick={handleUploadImage}
            >
              Upload
            </Button>
          ) : (
            <Button
              type="primary"
              size={"large"}
              icon={<UploadOutlined />}
              onClick={onChooseFile}
            >
              Choose Image
            </Button>
          )}
          <div className="img-seen-wrapper">
            {imageUpload[0]?.map((item: any, index: any) => {
              const imageUrl = URL.createObjectURL(item);
              return (
                <div className="img-seen-container">
                  <div
                    className="remove-icon"
                    onClick={() => handleRemoveImage(item)}
                  >
                    x
                  </div>

                  <img src={imageUrl} className="img-seen" key={index} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="image-wrap">
          <PhotoProvider>
            <ResponsiveMasonry columnsCountBreakPoints={objectResponse}>
              <Masonry columnsCount={4} gutter={`${GUTTER_MANSORY}px`}>
                {data &&
                  data?.map((item: any, index: any) => (
                    <PhotoView src={item.originalURL} key={item.id}>
                      <span
                        style={{
                          width: "100%",
                          height: Math.floor(
                            item?.aspecratio * widthThumbFirstRender
                          ),
                          border: "1px solid red",
                          borderRadius: "8px",
                          position: "relative",
                        }}
                      >
                        <img
                          src={item.thumbURL}
                          className="main-img"
                          style={{
                            objectFit: "cover",
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                          }}
                          key={index}
                        />
                      </span>
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
