import React from 'react';
import QueryExt from './QueryExt';
import QuerySimple from './QuerySimple';

const Request = () => {
  const pathArray = window.location.pathname.split('/');
  const handleUrl = pathArray[pathArray.length - 1];
  const handlePart = handleUrl.split('-');
  if (handlePart.includes('extended')) {
    return <QueryExt />;
  }
  return <QuerySimple />;
};

export default Request;
