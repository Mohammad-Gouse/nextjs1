import React, { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton
} from '@mui/material'
import axios from 'axios'
import Configuration from 'src/context/Configuration'
import createAxiosInstance from 'src/context/createAxiosInstance'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'

import Loader from '../../../../pages/Loader'
import { ConfirmationDialog } from 'src/components/ConfirmationDialog'
import { bottom } from '@popperjs/core'

const Addpricecomponent = () => {
  const axiosInstance = createAxiosInstance()
  const matches = useMediaQuery('(min-width:1030px)')
  const theme = useTheme()

  const retrievedArrayString = localStorage.getItem('myArray');
  const retrievedArray = JSON.parse(retrievedArrayString);

  // const [initialData, setInitialData] = useState([{
  //   shape: null,
  //   clarity: null,
  //   colour: null,
  //   carat: null,
  //   price: null,
  //   product_id: null
  // }])

  console.log(retrievedArray.tags)

  const [initialData, setInitialData] = useState(retrievedArray?.tags)

  console.log(initialData)



  const [shapeList, setShapeList] = useState([])
  const [clarityList, setClarityList] = useState([])
  const [colourList, setColourList] = useState([])

  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [severity, setSeverity] = useState('success')
  const [openAlert, setOpenAlert] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(true)


  const addTagForm = useForm()
  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit
  } = addTagForm

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags'
  })

  const handleCloseAlert = () => {
    setOpenAlert(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      const getShape = await axiosInstance.post(`${Configuration.baseUrl}/master/shape/$}`)
      setShapeList(getShape.data.response.data)
    }
    const fetchDataColour = async () => {
      const getShape = await axiosInstance.post(`${Configuration.baseUrl}/master/colour/$}`)
      setColourList(getShape.data.response.data)
    }
    const fetchDataClarity = async () => {
      const getShape = await axiosInstance.post(`${Configuration.baseUrl}/master/clarity/$}`)
      setClarityList(getShape.data.response.data)
    }
    fetchData()
    fetchDataColour()
    fetchDataClarity()
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(`${Configuration.baseUrl}/users/price/:num`)
        const data = response?.data?.response?.data
        // Save fetched data into state
        // setInitialData(data)
        // Extract unique shapes, clarities, and colours
        const uniqueShapes = Array.from(new Set(data.map(item => item.shape)))
        const uniqueClarities = Array.from(new Set(data.map(item => item.clarity)))
        const uniqueColours = Array.from(new Set(data.map(item => item.colour)))
        // Map unique shapes, clarities, and colours to format required by Select component
        setShapeList(uniqueShapes.map(shape => ({ id: shape, name: shape })))
        setClarityList(uniqueClarities.map(clarity => ({ id: clarity, name: clarity })))
        setColourList(uniqueColours.map(colour => ({ id: colour, name: colour })))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    // fetchData()
  }, [])

  useEffect(() => {
    // Initially show one empty tag field
    if (open && fields.length === 0) {
      // append({})
    }
  }, [open, fields.length])

  useEffect(() => {
    // Check if initial data is available and initialize tag fields
    if (initialData.length > 0) {
      initialData.forEach(dataItem => {
        // Append tag fields for each fetched record
        append({
          shape: dataItem.shape,
          clarity: dataItem.clarity,
          colour: dataItem.colour,
          carat: dataItem.carat,
          price: dataItem.price,
          newPrice: dataItem.newPrice,
          product_id: dataItem.product_id
        })
      })
    }
  }, [initialData, append])

  // const addPrice = async data => {
  //   // setIsLoading(true)
  //   // try {
  //   //   const response = await axiosInstance.post(`${Configuration.baseUrl}/master/add-user-price`, data)
  //   //   setSnackbarMessage(response.data.message)
  //   //   setSeverity('success')
  //   //   setOpenAlert(true)
  //   // } catch (err) {
  //   //   setSnackbarMessage(err.response.data.message)
  //   //   setSeverity('error')
  //   //   setOpenAlert(true)
  //   // } finally {
  //   //   setIsLoading(false)
  //   // }
  //   addTagForm.trigger().then(isValid => {
  //     if (isValid) {
  //       const data = {
  //         tags: getValues('tags').map(tag => ({
  //           // Include all fields in the request payload
  //           shape: tag.shape,
  //           clarity: tag.clarity,
  //           size: tag.size,
  //           colour: tag.colour,
  //           price: tag.price
  //         }))
  //       };)
  // }

  const addPrice = () => {


    // Perform form validation
    addTagForm.trigger().then(isValid => {
      if (isValid) {
        const data = {
          tags: getValues('tags').map(tag => ({
            product_id: tag.product_id,
            price: tag.price,
            newPrice: tag.newPrice,
            carat: tag.carat,
            clarity: tag.clarity,
            colour: tag.colour,
            shape: tag.shape
          }))
        }
        console.log(data)
        const myArrayString = JSON.stringify(data);
        localStorage.setItem('myArray', myArrayString);
        axiosInstance
          .post(`${Configuration.baseUrl}/master/add-user-price`, data)
          .then(res => {
            setSnackbarMessage(res.data.message)
            setSeverity('success')
            setOpenAlert(true)
            setIsLoading(false)
          })
          .catch(err => {
            setIsLoading(false)
            setSnackbarMessage(err.response.data.message)
            setSeverity('error')
            setOpenAlert(true)
          })
      }
    })
  }

  //open confirmation ADD

  // const [openAddConfirmDialog, setOpenAddConfirmDialog] = useState(false)

  // const handleCloseAddConfirmDialog = () => {
  //   setOpenAddConfirmDialog(false)
  // }

  // const handleAddOpenConfirmDialog = () => {
  //   setOpenAddConfirmDialog(true)
  // }

  // const handleAdd = () => {
  //   addPrice()
  //   handleCloseAddConfirmDialog()
  // }

  //open confirm dialog Clear

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false)
  }

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true)
  }

  const handleResetCloseDialog = () => {
    addTagForm.reset()
    handleCloseConfirmDialog()
  }

  //save data locally



  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          minHeight: '70vh',
          margin: 3
        }}
      >
        <Grid container sx={{ padding: 1 }}>
          <Grid item xs={12} sm={12} md={2}>
            <Typography variant='h6' component='h4' sx={{ color: '#252430' }}>
              Add Price
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Divider sx={{ borderColor: '#252430' }} />
          </Grid>
        </Grid>
        {/* <form onSubmit={handleSubmit(addPrice)}> */}
        <form>
          {fields.map((field, index) => (
            <Grid container spacing={2} key={field.id} sx={{ padding: 1 }}>
              <Grid item xs={12} sm={4} md={1}>
                <Box>
                  <FormControl fullWidth size='small' error={!!errors.tags?.[index]?.shape}>
                    <InputLabel id={`shape-label-${index}`}>Shape</InputLabel>
                    <Controller
                      name={`tags[${index}].shape`}
                      control={control}
                      rules={{ required: 'Shape is required' }}
                      render={({ field }) => (
                        <Select {...field} labelId={`shape-label-${index}`} id={`shape-select-${index}`} label='Shape'>
                          {shapeList.length > 0 ? (
                            shapeList.map(option => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem value='' disabled>
                              Loading...
                            </MenuItem>
                          )}
                        </Select>
                      )}
                    />
                    {errors.tags?.[index]?.shape && (
                      <Typography color='error'>{errors.tags[index].shape.message}</Typography>
                    )}
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4} md={1}>
                <Box>
                  <FormControl fullWidth size='small' error={!!errors.tags?.[index]?.clarity}>
                    <InputLabel id={`clarity-label-${index}`}>Clarity</InputLabel>
                    <Controller
                      name={`tags[${index}].clarity`}
                      control={control}
                      rules={{ required: 'Clarity is required' }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId={`clarity-label-${index}`}
                          id={`clarity-select-${index}`}
                          label='Clarity'
                        >
                          {clarityList.length > 0 ? (
                            clarityList.map(option => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem value='' disabled>
                              Loading...
                            </MenuItem>
                          )}
                        </Select>
                      )}
                    />
                    {errors.tags?.[index]?.clarity && (
                      <Typography color='error'>{errors.tags[index].clarity.message}</Typography>
                    )}
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4} md={1}>
                <Box>
                  <FormControl fullWidth size='small' error={!!errors.tags?.[index]?.colour}>
                    <InputLabel id={`colour-label-${index}`}>Colour</InputLabel>
                    <Controller
                      name={`tags[${index}].colour`}
                      control={control}
                      rules={{ required: 'Colour is required' }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId={`colour-label-${index}`}
                          id={`colour-select-${index}`}
                          label='Colour'
                        >
                          {colourList.length > 0 ? (
                            colourList.map(option => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem value='' disabled>
                              Loading...
                            </MenuItem>
                          )}
                        </Select>
                      )}
                    />
                    {errors.tags?.[index]?.colour && (
                      <Typography color='error'>{errors.tags[index].colour.message}</Typography>
                    )}
                  </FormControl>
                </Box>
              </Grid>
              <Controller
                name={`tags[${index}].product_id`}
                control={control}
                render={({ field }) => null} // Render nothing
              />
              <Grid item xs={12} md={1} sm={4}>
                <Controller
                  name={`tags[${index}].carat`}
                  control={control}
                  rules={{ required: 'Carat is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Carat'
                      type='number'
                      variant='outlined'
                      fullWidth
                      size='small'
                      error={!!errors.tags?.[index]?.carat}
                      helperText={errors.tags?.[index]?.carat ? 'Carat is required' : ''}
                      inputProps={{ step: 0.01, min: 0.0, max: 10.99 }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={1.5}>
                <Controller
                  name={`tags[${index}].price`}
                  control={control}
                  rules={{ required: 'Last Input Price is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Last Input Price'
                      type='number'
                      variant='outlined'
                      fullWidth
                      size='small'
                      error={!!errors.tags?.[index]?.price}
                      helperText={errors.tags?.[index]?.price ? 'Last Input Price is required' : ''}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={1.5}>
                <Controller
                  name={`tags[${index}].newPrice`}
                  control={control}
                  rules={{ required: 'Price is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label='Price'
                      type='number'
                      variant='outlined'
                      fullWidth
                      size='small'
                      error={!!errors.tags?.[index]?.newPrice}
                      helperText={errors.tags?.[index]?.newPrice ? 'Price is required' : ''}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={0.5} md={0.5}>
                {fields.length > 1 && (
                  <IconButton onClick={() => remove(index)} sx={{ mt: 0.5 }}>
                    <Icon icon='mdi-close' style={{ cursor: 'pointer' }} />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Button
              variant='contained'
              size='small'
              type='button'
              onClick={() => append({})}
              sx={{ backgroundColor: theme.palette.primary.main, color: 'white', marginTop: 2 }}
            >
              <Icon icon='carbon:add-filled' height='18' width='18' style={{ color: 'white' }} />
              <Typography variant='body2' sx={{ color: 'white', ml: 1 }}>
                Add more
              </Typography>
            </Button>
          </Grid>
          <Grid container spacing={2} sx={{ padding: 1, marginTop: 2 }}>
            <Grid item xs={12} sm={4} md={2}>
              <Button variant='contained' fullWidth size='medium'
                onClick={() => {
                  // handleAddOpenConfirmDialog()
                  addPrice()
                }}>
                Add
              </Button>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <Button
                variant='outlined'
                fullWidth
                size='medium'
                onClick={() => {
                  // addTagForm.reset()
                  handleOpenConfirmDialog()
                }}
              >
                Clear All
              </Button>
            </Grid>
          </Grid>

          {/* <ConfirmationDialog dialogOpen={openAddConfirmDialog} onClose={handleCloseAddConfirmDialog} onConfirm={handleAdd} data={'Add'} /> */}
          <ConfirmationDialog dialogOpen={openConfirmDialog} onClose={handleCloseConfirmDialog} onConfirm={handleResetCloseDialog} data={'Clear'} />
        </form>
      </Box>
      {isLoading && <Loader />}
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%', marginBottom: '30px' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Addpricecomponent
