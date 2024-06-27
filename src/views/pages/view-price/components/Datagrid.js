import {
  Box,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery
} from '@mui/material'
import createAxiosInstance from 'src/context/createAxiosInstance'
import axios, { Axios } from 'axios'
import Configuration from 'src/context/Configuration'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@emotion/react'
// import "./styles/Datagrid.css"
const Datagrid = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL
  const [shapeList, setShapeList] = useState([])
  const [caratId, setCaratId] = useState('')
  const [productData, setProductData] = useState([])
  const axiosInstance = createAxiosInstance()
  const transformData = data => {
    console.log({ data })
    if (data) {
      const result = {}

      data.forEach(item => {
        const color = item.colour
        const clarity = item.clarity
        const price = item.last_price ?? 'N/A'

        if (!result[color]) {
          result[color] = {}
        }

        result[color][clarity] = price
      })
      const sortedResult = {}
      Object.keys(result)
        .sort()
        .forEach(key => {
          sortedResult[key] = result[key]
        })
      console.log({ sortedResult })
      return sortedResult
    } else {
      return {}
    }
  }

  const [data, setData] = useState(transformData(productData))

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'))

  useEffect(() => {
    const fetchData = async () => {
      const getShape = await axiosInstance.post(`${Configuration.baseUrl}/master/shape/$}`)
      setShapeList(getShape.data.response.data)
    }
    const fetchDataColour = async () => {
      const getShape = await axiosInstance.post(`${Configuration.baseUrl}/master/colour/$}`)
      console.log(getShape.data.response.data)
      setColour(getShape.data.response.data)
    }

    fetchData()
    fetchDataColour()
  }, [])

  // Assset Type
  const [assetType, setAssetType] = useState('natural')
  const handleChange = (event, newAlignment) => {
    setAssetType(newAlignment)
  }
  // Shape Type
  const [shape, setShape] = useState('')
  const handleChangeShape = event => {
    setShape(event.target.value)
  }
  // size carat
  const [carat, setSize] = useState(0.01)
  const handleChangeSize = event => {
    console.log(event)
  }

  const [colour, setColour] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const getSizeId = await axiosInstance.post(`${Configuration.baseUrl}/master/size/0?carat=${carat}`)
      setCaratId(getSizeId.data.response.data[0].id)
    }

    fetchData()
  }, [carat])

  useEffect(() => {
    const fetchData = async () => {
      const getMultiFilter = await axiosInstance.post(
        `${Configuration.baseUrl}/master/multi-filter/0?hitsPerPage=121&size=${caratId}&shape=${shape}`
      )
      console.log(getMultiFilter.data.message.data)
      setProductData(getMultiFilter.data.message.data)

      setData(transformData(getMultiFilter.data.message.data))
    }
    fetchData()
  }, [caratId, shape])

  return (
    <Box
      sx={{
        backgroundColor: 'white'
      }}
    >
      <Grid container sx={{ padding: 1 }}>
        <Grid item xs={12} sm={12} md={2}>
          <Typography variant='h6' component='h4' sx={{ color: '#252430' }}>
            View Price
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Divider sx={{ borderColor: '#252430' }} />
        </Grid>
      </Grid>
      <Grid container spacing={1} padding={2}>
        {/* <Grid item xs={12} md={1.5} sm={6}>
          <ToggleButtonGroup
            color='primary'
            // value={assetType}
            exclusive
            // onChange={handleChange}
            aria-label='Platform'
            className='Asset-Button'
            fullWidth
            size='small'
          >
            <ToggleButton value='natural' className='selected-asset'>
              Natural
            </ToggleButton>
            <ToggleButton value='LGD' className='selected-asset'>
              LGD
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid> */}
        <Grid item xs={12} md={1} sm={6}>
          <Box sx={{ display: 'flex' }}>
            <FormControl fullWidth size='small'>
              <InputLabel id='demo-simple-select-label'>Shape</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={shape}
                label='Shape'
                onChange={handleChangeShape}
              >
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
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} md={1} sm={6}>
          <TextField
            id='outlined-basic'
            label='Carat'
            type='number'
            variant='outlined'
            fullWidth
            size='small'
            inputProps={{ step: 0.01, min: 0.01, max: 10.99 }}
            onChange={e => {
              setSize(e.target.value)
            }}
          />
        </Grid>
        <Grid item xs={12} md={1} sm={6}>
          <Box sx={{ display: 'flex' }}>
            <FormControl fullWidth size='small'>
              <InputLabel id='demo-simple-select-label'>Day</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={shape}
                label='day'
                onChange={handleChangeShape}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={1} padding={2}>
        <Grid Item xs={12} md={12} sm={12}>
          <TableContainer>
            <Table aria-label='simple table'>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#E3F4ED' }}>
                  <TableCell
                    align='left'
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', width: '2%' } }}
                  ></TableCell>
                  <TableCell
                    align='left'
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', width: '2%' } }}
                  >
                    I1
                  </TableCell>
                  <TableCell
                    align='left'
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', width: '2%' } }}
                  >
                    I2
                  </TableCell>
                  <TableCell
                    align='left'
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', width: '2%' } }}
                  >
                    I3
                  </TableCell>
                  <TableCell
                    align='left'
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', width: '2%' } }}
                  >
                    IF
                  </TableCell>
                  <TableCell
                    align='left'
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', width: '2%' } }}
                  >
                    VVS1
                  </TableCell>
                  <TableCell
                    align='left'
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', width: '2%' } }}
                  >
                    VVS2
                  </TableCell>
                  <TableCell
                    align='left'
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', width: '2%' } }}
                  >
                    VS1
                  </TableCell>
                  <TableCell
                    align='left'
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', width: '2%' } }}
                  >
                    VS2
                  </TableCell>
                  <TableCell
                    align='left'
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', width: '2%' } }}
                  >
                    SI1
                  </TableCell>
                  <TableCell
                    align='left'
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', width: '2%' } }}
                  >
                    SI2
                  </TableCell>
                  {/* <TableCell
                    align='left'
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', width: '5%' } }}
                  >
                    SI3
                  </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(data).map(([color, clarities]) => {
                  console.log(clarities.SI3)
                  return (
                    <TableRow key={color} sx={{ maxheight: '5rem' }}>
                      <TableCell
                        sx={{
                          fontSize: {
                            xs: '0.75rem',
                            sm: '0.875rem',
                            md: '1rem',
                            lg: '1.125rem',
                            backgroundColor: '#E3F4ED'
                          }
                        }}
                      >
                        {color}
                      </TableCell>
                      <TableCell
                        align='left'
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' } }}
                      >
                        {clarities.I1 || 'N/A'}
                      </TableCell>
                      <TableCell
                        align='left'
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' } }}
                      >
                        {clarities.I2 || 'N/A'}
                      </TableCell>
                      <TableCell
                        align='left'
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' } }}
                      >
                        {clarities.I3 || 'N/A'}
                      </TableCell>
                      <TableCell
                        align='left'
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' } }}
                      >
                        {clarities.IF || 'N/A'}
                      </TableCell>
                      <TableCell
                        align='left'
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' } }}
                      >
                        {clarities.VVS1 || 'N/A'}
                      </TableCell>
                      <TableCell
                        align='left'
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' } }}
                      >
                        {clarities.VVS2 || 'N/A'}
                      </TableCell>
                      <TableCell
                        align='left'
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' } }}
                      >
                        {clarities.VS1 || 'N/A'}
                      </TableCell>

                      <TableCell
                        align='left'
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' } }}
                      >
                        {clarities.SI1 || 'N/A'}
                      </TableCell>
                      <TableCell
                        align='left'
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' } }}
                      >
                        {clarities.SI2 || 'N/A'}
                      </TableCell>
                      <TableCell
                        align='left'
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' } }}
                      >
                        {clarities.SI3 !== undefined ? clarities.SI3 : 'N/A'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {/* <Grid item xs={1} md={0.5} sm={1} sx={{ backgroundColor: '#E3F4ED' }}>
          <Typography align='left' sx={{ marginLeft: '2vh', fontSize: 16 }}></Typography>
          <Typography variant='h6' align='left' sx={{ marginLeft: '2vh', marginTop: '3vh', fontSize: 16 }}>
            D
          </Typography>
          <Typography variant='body1' align='left' sx={{ marginLeft: '2vh', marginTop: '5vh', fontSize: 16 }}>
            E
          </Typography>
          <Typography variant='body1' align='left' sx={{ marginLeft: '2vh', marginTop: '5vh', fontSize: 16 }}>
            G
          </Typography>
          <Typography variant='body1' align='left' sx={{ marginLeft: '2vh', marginTop: '5vh', fontSize: 16 }}>
            H
          </Typography>
          <Typography variant='body1' align='left' sx={{ marginLeft: '2vh', marginTop: '5vh', fontSize: 16 }}>
            I
          </Typography>
          <Typography
            variant='body1'
            align='left'
            sx={{ marginLeft: '2vh', marginTop: '5vh', fontSize: 14 }}
          ></Typography>
        </Grid> */}
      </Grid>
    </Box>
  )
}

export default Datagrid
