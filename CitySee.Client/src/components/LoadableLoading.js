import React from 'react'
import Spinner from './Spinner'

function LoadableLoading(props) {
    if (props.isLoading) {
      if (props.timedOut) {
        return <div>载入超时</div>;
      } else if (props.pastDelay) {
        return <Spinner />;
      } else {
        return null;
      }
    } else if (props.error) {
      return <div>载入失败</div>;
    } else {
      return null;
    }
  }

  export default LoadableLoading;