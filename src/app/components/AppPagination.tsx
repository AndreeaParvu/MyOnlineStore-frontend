//setting up pagination on the client

import { Box, Pagination, Typography } from "@mui/material";
import { PageMetadata } from "../models/product";

interface Props {
    pagedMetadata: PageMetadata;
    onPageChange: (page: number) => void
}

export default function AppPagination({ pagedMetadata, onPageChange } : Props) {
    const { number: currentPage, totalElements, totalPages, size: pageSize } = pagedMetadata;
    const currentPageForDisplay = currentPage ? currentPage + 1 : 1;

    return (
        <Box display='flex' justifyContent={'space-between'} alignItems='center'>
            <Typography>
                Displaying {(currentPageForDisplay - 1) * pageSize + 1} - {currentPageForDisplay * pageSize > totalElements
                ? totalElements : currentPageForDisplay * pageSize} of {totalElements} items
            </Typography>
            <Pagination
               color="secondary"
               size="large"
               count={totalPages}
               page={currentPageForDisplay}
               onChange={(e, page) => onPageChange(page)}
             />
        </Box>
    );
}