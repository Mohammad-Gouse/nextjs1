const { Dialog, DialogTitle, Typography, DialogContent, Box, Button } = require('@mui/material')

export const ConfirmationDialog = ({ dialogOpen, onConfirm, onClose, data }) => {
    return (
        <Dialog width='auto' height='auto' max open={dialogOpen} onClose={onClose}>
            <DialogTitle>
                <Typography variant='h5' component='span'>
                    {data} Confirmation
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box display='flex' flexDirection='column' gap='20px'>
                    <Typography>Are you sure you want to {data} all?</Typography>
                    <Box display='flex' justifyContent='flex-end' gap='10px'>
                        <Button onClick={onClose} variant='contained'>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                onConfirm()
                            }}
                            variant='outlined'
                        >
                            Yes
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    )
}