import React from 'react';
import * as RNW from 'react-native-web';
import { codegenNativeComponent } from './codegenNativeComponent';

export const TurboModuleRegistry = {
  get: () => null,
  getEnforcing: () => null,
};

export const UnimplementedView = RNW.UnimplementedView || RNW.View;
export { codegenNativeComponent };

function processStyle(styleVal) {
  if (!styleVal) return styleVal;
  let flat = styleVal;
  if (Array.isArray(styleVal) || typeof styleVal === 'number') {
    flat = RNW.StyleSheet.flatten(styleVal);
  }
  if (Array.isArray(flat)) {
    flat = Object.assign({}, ...flat.flat(Infinity).map(s => (typeof s === 'number' ? RNW.StyleSheet.flatten(s) : s)).filter(Boolean));
  }
  if (flat && typeof flat === 'object') {
    if (flat.shadowColor || flat.shadowOffset || flat.shadowOpacity || flat.shadowRadius) {
      const { shadowColor, shadowOffset, shadowOpacity, shadowRadius, ...rest } = flat;
      const offsetX = shadowOffset?.width || 0;
      const offsetY = shadowOffset?.height || 0;
      const radius = shadowRadius || 0;
      const color = shadowColor || 'rgba(0,0,0,0.1)';
      rest.boxShadow = `${offsetX}px ${offsetY}px ${radius}px ${color}`;
      flat = rest;
    }
  }
  return flat;
}

function wrapComponent(Comp) {
  if (!Comp || (typeof Comp !== 'function' && typeof Comp !== 'object')) return Comp;
  const Wrapped = React.forwardRef((props, ref) => {
    if (props) {
      const safeStyle = processStyle(props.style);
      return React.createElement(Comp, { ...props, style: safeStyle, ref });
    }
    return React.createElement(Comp, { ...props, ref });
  });
  Wrapped.displayName = Comp.displayName || Comp.name || 'WrappedComponent';
  return Wrapped;
}

export const View = wrapComponent(RNW.View);
export const Text = wrapComponent(RNW.Text);
export const TouchableOpacity = wrapComponent(RNW.TouchableOpacity);
export const Pressable = wrapComponent(RNW.Pressable);
export const ScrollView = wrapComponent(RNW.ScrollView);
export const TextInput = wrapComponent(RNW.TextInput);
export const Image = wrapComponent(RNW.Image);
export const FlatList = wrapComponent(RNW.FlatList);
export const SectionList = wrapComponent(RNW.SectionList);
export const SafeAreaView = wrapComponent(RNW.SafeAreaView || RNW.View);
export const KeyboardAvoidingView = wrapComponent(RNW.KeyboardAvoidingView || RNW.View);
export const ActivityIndicator = wrapComponent(RNW.ActivityIndicator);
export const Switch = wrapComponent(RNW.Switch);
export const TouchableHighlight = wrapComponent(RNW.TouchableHighlight || RNW.TouchableOpacity);
export const TouchableWithoutFeedback = wrapComponent(RNW.TouchableWithoutFeedback || RNW.TouchableOpacity);
export const StatusBar = wrapComponent(RNW.StatusBar || RNW.View);

// Custom web-compatible Modal component to ensure all modals open reliably on web preview
export const Modal = React.forwardRef(({ visible = true, children, onRequestClose, transparent = true, animationType = 'fade', style, ...props }, ref) => {
  if (visible === false) return null;

  return React.createElement(
    'div',
    {
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: transparent ? 'rgba(0, 0, 0, 0.75)' : '#15002b',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999999,
        overflowY: 'auto',
        backdropFilter: 'blur(4px)',
      },
      onClick: (e) => {
        if (e.target === e.currentTarget && onRequestClose) {
          onRequestClose();
        }
      },
    },
    React.createElement(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ...(processStyle(style) || {}),
        },
      },
      children
    )
  );
});
Modal.displayName = 'Modal';

export const Animated = {
  ...RNW.Animated,
  View: wrapComponent(RNW.Animated ? RNW.Animated.View : RNW.View),
  Text: wrapComponent(RNW.Animated ? RNW.Animated.Text : RNW.Text),
  Image: wrapComponent(RNW.Animated ? RNW.Animated.Image : RNW.Image),
  ScrollView: wrapComponent(RNW.Animated ? RNW.Animated.ScrollView : RNW.ScrollView),
  FlatList: wrapComponent(RNW.Animated ? RNW.Animated.FlatList : RNW.FlatList),
};

export const StyleSheet = RNW.StyleSheet;
export const Platform = RNW.Platform;
export const Dimensions = RNW.Dimensions;
export const Alert = RNW.Alert;
export const Linking = RNW.Linking;

export default {
  ...RNW.default,
  ...RNW,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  FlatList,
  SectionList,
  SafeAreaView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Switch,
  TouchableHighlight,
  TouchableWithoutFeedback,
  StatusBar,
  Modal,
  Animated,
  StyleSheet,
  Platform,
  Dimensions,
  Alert,
  Linking,
};

export * from 'react-native-web';
