'use client';

import { useState, useCallback } from 'react';
import { AppState, UploadedImage, Style, ProcessingStatus } from '@/types';

const initialState: AppState = {
    uploadedImage: null,
    selectedStyle: null,
    processingStatus: null,
    resultImage: null,
};

export function useAppState() {
    const [state, setState] = useState<AppState>(initialState);

    const setUploadedImage = useCallback((image: UploadedImage | null) => {
        setState((prev) => ({ ...prev, uploadedImage: image }));
    }, []);

    const setSelectedStyle = useCallback((style: Style | null) => {
        setState((prev) => ({ ...prev, selectedStyle: style }));
    }, []);

    const setProcessingStatus = useCallback((status: ProcessingStatus | null) => {
        setState((prev) => ({ ...prev, processingStatus: status }));
    }, []);

    const setResultImage = useCallback((image: string | null) => {
        setState((prev) => ({ ...prev, resultImage: image }));
    }, []);

    const reset = useCallback(() => {
        setState(initialState);
    }, []);

    return {
        ...state,
        setUploadedImage,
        setSelectedStyle,
        setProcessingStatus,
        setResultImage,
        reset,
    };
}
