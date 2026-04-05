import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import {
  Detection,
  ObjectDetectionModelSources,
  RF_DETR_NANO,
  SSDLITE_320_MOBILENET_V3_LARGE,
  useObjectDetection,
  YOLO26L,
  YOLO26M,
  YOLO26N,
  YOLO26S,
  YOLO26X,
} from 'react-native-executorch';
import { BottomBar } from '../../components/BottomBar';
import ErrorBanner from '../../components/ErrorBanner';
import ImageWithBboxes from '../../components/ImageWithBboxes';
import { ModelOption, ModelPicker } from '../../components/ModelPicker';
import Spinner from '../../components/Spinner';
import { StatsBar } from '../../components/StatsBar';
import { GeneratingContext } from '../../context';
import ScreenWrapper from '../../ScreenWrapper';
import { getImage } from '../../utils';

const MODELS: ModelOption<ObjectDetectionModelSources>[] = [
  { label: 'RF-DeTR Nano', value: RF_DETR_NANO },
  { label: 'SSDLite MobileNet', value: SSDLITE_320_MOBILENET_V3_LARGE },
  { label: 'YOLO26N', value: YOLO26N },
  { label: 'YOLO26S', value: YOLO26S },
  { label: 'YOLO26M', value: YOLO26M },
  { label: 'YOLO26L', value: YOLO26L },
  { label: 'YOLO26X', value: YOLO26X },
];

export default function ObjectDetectionScreen() {
  const [imageUri, setImageUri] = useState('');
  const [results, setResults] = useState<Detection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  }>();
  const [selectedModel, setSelectedModel] =
    useState<ObjectDetectionModelSources>(RF_DETR_NANO);
  const [inferenceTime, setInferenceTime] = useState<number | null>(null);

  const model = useObjectDetection({ model: selectedModel });
  const { setGlobalGenerating } = useContext(GeneratingContext);
  useEffect(() => {
    setGlobalGenerating(model.isGenerating);
  }, [model.isGenerating, setGlobalGenerating]);

  useEffect(() => {
    if (model.error) setError(String(model.error));
  }, [model.error]);

  const handleCameraPress = async (isCamera: boolean) => {
    const image = await getImage(isCamera);
    const uri = image?.uri;
    const width = image?.width;
    const height = image?.height;

    if (uri && width && height) {
      setImageUri(image.uri as string);
      setImageDimensions({ width: width as number, height: height as number });
      setResults([]);
      setInferenceTime(null);
    }
  };

  const runForward = async () => {
    if (imageUri) {
      try {
        const start = Date.now();
        const output = await model.forward(imageUri);
        setInferenceTime(Date.now() - start);
        setResults(output);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    }
  };

  if (!model.isReady) {
    return (
      <Spinner
        visible={!model.isReady}
        textContent={`Loading the model ${(model.downloadProgress * 100).toFixed(0)} %`}
      />
    );
  }

  console.log(JSON.stringify(imageDimensions, null, 4))
  console.log("results", JSON.stringify(results, null, 4))

  return (
    <ScreenWrapper>
      <ErrorBanner message={error} onDismiss={() => setError(null)} />
      <View style={styles.imageContainer}>
        <View style={styles.image}>
          {imageUri && imageDimensions?.width && imageDimensions?.height ? (
            <ImageWithBboxes
              imageUri={
                imageUri || require('../../assets/images/icon.png')
              }
              imageWidth={imageDimensions.width}
              imageHeight={imageDimensions.height}
              detections={results}
            />
          ) : (
            <Image
              style={styles.fullSizeImage}
              resizeMode="contain"
              source={require('../../assets/images/icon.png')}
            />
          )}
        </View>
        {!imageUri && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Object Detection</Text>
            <Text style={styles.infoText}>
              This model detects objects in an image and draws bounding boxes
              around them with class labels and confidence scores. Pick an image
              from your gallery or take one with your camera to get started.
            </Text>
          </View>
        )}
      </View>
      <ModelPicker
        models={MODELS}
        selectedModel={selectedModel}
        disabled={model.isGenerating}
        onSelect={(m) => {
          setSelectedModel(m);
          setResults([]);
        }}
      />
      <StatsBar
        inferenceTime={inferenceTime}
        detectionCount={results.length > 0 ? results.length : null}
      />
      <BottomBar
        handleCameraPress={handleCameraPress}
        runForward={runForward}
        hasImage={!!imageUri}
        isGenerating={model.isGenerating}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 6,
    width: '100%',
    padding: 16,
  },
  image: {
    flex: 2,
    borderRadius: 8,
    width: '100%',
  },
  fullSizeImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'navy',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
});
