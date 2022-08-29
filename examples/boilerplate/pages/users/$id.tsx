import React from 'react';
import { useParams } from 'umi';

export default (props: any) => {
  const params = useParams<{ id: string }>();
  console.log(props);
  return <h2>user: {params.id}</h2>;
};
