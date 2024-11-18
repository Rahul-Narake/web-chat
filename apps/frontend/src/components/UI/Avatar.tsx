import React from 'react';
function Avatar({
  url = 'https://tse1.mm.bing.net/th?id=OIP.L8bs33mJBAUBA01wBfJnjQHaHa&pid=Api&P=0&h=180',
  width = '40',
  height = '40',
}: {
  url?: string;
  width?: string;
  height?: string;
}) {
  return (
    <img
      className={`w-[40px] h-[40px] rounded-full  justify-center items-center`}
      src={
        url ||
        'https://tse1.mm.bing.net/th?id=OIP.L8bs33mJBAUBA01wBfJnjQHaHa&pid=Api&P=0&h=180'
      }
      alt="avatar"
    />
  );
}

export default React.memo(Avatar);
