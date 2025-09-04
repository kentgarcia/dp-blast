'use client';

import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import Questionnaire from '@/components/Questionnaire';
import ImageUpload from '@/components/ImageUpload';
import Preview from '@/components/Preview';
import { AppState, UserInfo, ImagePosition } from '@/types';

export default function Home() {
  const [state, setState] = useState<AppState>({
    step: 'landing',
    userInfo: null,
    uploadedImage: null,
    imagePosition: null,
    processedImage: null,
  });

  const handleGetStarted = () => {
    setState(prev => ({
      ...prev,
      step: 'questionnaire',
    }));
  };

  const handleQuestionnaireComplete = (userInfo: UserInfo) => {
    setState(prev => ({
      ...prev,
      step: 'upload',
      userInfo,
    }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setState(prev => ({
      ...prev,
      step: 'preview',
      uploadedImage: imageUrl,
      imagePosition: {
        x: 0,
        y: 0,
        scale: 1,
        width: 300,
        height: 300,
      },
    }));
  };

  const handlePositionUpdate = (position: ImagePosition) => {
    setState(prev => ({
      ...prev,
      imagePosition: position,
    }));
  };

  const handleBackToUpload = () => {
    setState(prev => ({
      ...prev,
      step: 'upload',
      uploadedImage: null,
      imagePosition: null,
    }));
  };

  const handleBackToQuestionnaire = () => {
    setState(prev => ({
      ...prev,
      step: 'questionnaire',
      userInfo: null,
    }));
  };

  const handleStartOver = () => {
    setState({
      step: 'landing',
      userInfo: null,
      uploadedImage: null,
      imagePosition: null,
      processedImage: null,
    });
  };

  if (state.step === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (state.step === 'questionnaire') {
    return <Questionnaire onSubmit={handleQuestionnaireComplete} onBack={handleStartOver} />;
  }

  if (state.step === 'upload' && state.userInfo) {
    return (
      <ImageUpload
        userInfo={state.userInfo}
        onImageUpload={handleImageUpload}
        onBack={handleBackToQuestionnaire}
      />
    );
  }

  if (state.step === 'preview' && state.userInfo && state.uploadedImage && state.imagePosition) {
    return (
      <Preview
        userInfo={state.userInfo}
        uploadedImage={state.uploadedImage}
        imagePosition={state.imagePosition}
        onPositionUpdate={handlePositionUpdate}
        onBack={handleBackToUpload}
        onStartOver={handleStartOver}
      />
    );
  }

  return null;
}
