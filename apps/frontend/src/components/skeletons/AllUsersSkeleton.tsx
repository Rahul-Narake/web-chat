import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

function AllUsersSkeleton() {
  return (
    <Stack spacing={1}>
      <div className="flex items-center space-x-2">
        <Skeleton variant="circular" width={50} height={50} />
        <Skeleton variant="rectangular" width={250} height={40} />
      </div>
    </Stack>
  );
}

export default AllUsersSkeleton;
