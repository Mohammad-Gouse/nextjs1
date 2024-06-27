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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import createAxiosInstance from 'src/context/createAxiosInstance'
import Configuration from 'src/context/Configuration'
import Loader from 'src/pages/Loader'

const Admincomponents = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isFormValid, setIsFormValid] = useState(false)
  const [derivedPrice, setDerivedPrice] = useState(0)
  const [randomPrice, setRandomPrice] = useState(0)

  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [severity, setSeverity] = useState('success')
  const [openAlert, setOpenAlert] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(true)

  const handleCloseAlert = () => {
    setOpenAlert(false)
  }

  const [jsonData, setJsonData] = useState({
    payload: [],
    row_count: 0
  })
  const handleChangePage = newpage => {
    setPage(newpage + 1)
  }


  const columns = [
    { field: 'shape', headerName: 'Shape', width: 150, align: 'left' },
    { field: 'clarity', headerName: 'Clarity', width: 150, align: 'left' },
    { field: 'colour', headerName: 'Colour', width: 150, align: 'left' },
    { field: 'carat', headerName: 'Carat', width: 150, align: 'right', headerAlign: 'right' },
    { field: 'total_count', headerName: 'Total User', width: 150, align: 'right', headerAlign: 'right' },
    { field: 'last_price', headerName: 'Last Published Price', width: 200, align: 'right', headerAlign: 'right' },
    { field: 'new_price', headerName: 'Price', width: 150, align: 'right', headerAlign: 'right' },
    { field: 'price_type', headerName: 'Price Type', width: 150, align: 'left' },
    { field: 'price_difference', headerName: '% change', width: 150, align: 'right', headerAlign: 'right' },
    {
      field: 'admin_price',
      headerName: 'Admin Price',
      width: 200,
      renderCell: params => (
        <TextField
          variant='outlined'
          size='small'
          fullWidth
          value={params.row.admin_price || ''}
          onChange={e => handleAdminPriceChange(e, params)}
          type='number'
        />
      )
    }
  ]

  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
  ]
  const matches = useMediaQuery('(min-width:1030px')
  const [age, setAge] = useState('')
  const [assetType, setAssetType] = useState('natural')

  const handleChangeAsset = (event, newAlignment) => {
    setAssetType(newAlignment)
  }
  const handleChange = event => {
    setAge(event.target.value)
  }

  const [shapeList, setShapeList] = useState([])
  const [caratId, setCaratId] = useState('')
  const [clarityList, setClarityList] = useState([])
  const [colourList, setColourList] = useState([])
  const [productData, setProductData] = useState([])
  const [baseProduct, setBaseProduct] = useState([])

  const axiosInstance = createAxiosInstance()

  // const [data, setData] = useState(transformData(productData))

  useEffect(() => {
    const fetchData = async () => {
      const getShape = await axiosInstance.post(`${Configuration.baseUrl}/master/shape/$`)
      setShapeList(getShape.data.response.data)
    }
    const fetchDataColour = async () => {
      const getShape = await axiosInstance.post(`${Configuration.baseUrl}/master/colour/$`)
      setColourList(getShape.data.response.data)
    }
    const fetchDataClarity = async () => {
      const getClarity = await axiosInstance.post(`${Configuration.baseUrl}/master/Clarity/$`)
      setClarityList(getClarity.data.response.data)
    }
    const fetchDataBaseProduct = async () => {
      const getBaseProduct = await axiosInstance.post(`${Configuration.baseUrl}/master/get-base-product`)
      setBaseProduct(getBaseProduct.data.message)
    }

    fetchData()
    fetchDataColour()
    fetchDataClarity()
    // fetchDataBaseProduct()
  }, [])
  const [loading, setLoading] = useState(true)

  const fetchDataBaseProduct = async () => {
    setIsLoading(true)
    try {
      const getBaseProduct = await axiosInstance.post(`${Configuration.baseUrl}/master/get-base-product`)
      const data = getBaseProduct.data.message[0]
      setBaseProduct({
        carat: data.carat,
        clarity: data.clarity,
        shape: data.shape,
        colour: data.colour,
        corelation_factor: data.corelation_factor,
        system_derived_price: data.system_derived_price,
        price: data.price
      })
      setOpenAlert(true)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      // setSnackbarMessage(error?.response?.data?.message)
      setSeverity('error')
      setOpenAlert(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDataBaseProduct()
  }, [])

  // Shape Type
  const [shape, setShape] = useState('')
  const handleChangeShape = event => {
    setShape(event.target.value)
  }
  // clarity type
  const [clarity, setClarity] = useState('')
  const handleChangeClarity = event => {
    setClarity(event.target.value)
  }
  // colour type
  const [colour, setColour] = useState('')
  const handleChangeColour = event => {
    setColour(event.target.value)
  }
  // size carat
  const [carat, setCarat] = useState()
  useEffect(() => {
    const fetchData = async () => {
      const getSizeId = await axiosInstance.post(`${Configuration.baseUrl}/master/size/0?carat=${carat}`)
      if (getSizeId.data.response == undefined) {
        setCaratId()
      } else {
        setCaratId(getSizeId.data.response.data[0].id)
      }
    }
    if (carat == undefined) {
    } else {
      fetchData()
    }
  }, [carat])

  useEffect(() => {
    let params = {
      hitsPerPage: pageSize
    }
    const fetchData = async () => {
      if (caratId == undefined) {
        setCaratId('')
      }
      setIsLoading(true)
      const getMultiFilter = await axiosInstance.post(
        `${Configuration.baseUrl}/master/multi-filter/${page}?hitsPerPage=${pageSize}&shape=${shape}&size=${caratId}&clarity=${clarity}&colour=${colour}`
      )
      let updatedUsers = []
      let id = 0
      if (getMultiFilter.data.message == 'No data present') {
        setJsonData({
          payload: updatedUsers,
          row_count: getMultiFilter.data.message.totalDataCount
        })
        setIsLoading(false)
      } else {
        updatedUsers = getMultiFilter.data.message.data.map(data => {
          id++
          return {
            clarity: data.clarity,
            colour: data.colour,
            productid: data.product_id,
            id: data.product_id,
            underlying_asset: data.underlying_asset,
            shape: data.shape,
            carat: data.carat,
            corelation_factor: data.corelation_factor,
            dcx_price: data.dcx_price,
            total_count: data.total_count,
            last_price: data.last_price,
            new_price: '',
            price_type: '',
            admin_price: '',
            price_difference: data.price_difference
          }
        })

        console.log("getMultiFilter: ", getMultiFilter)
        setJsonData({
          payload: updatedUsers,
          row_count: getMultiFilter.data.message.totalDataCount
        })
        setIsLoading(false)
      }
    }
    fetchData()
  }, [page, pageSize, shape, clarity, caratId, shape, colour])

  const handleAdminPriceChange = (event, params) => {
    const updatedRows = jsonData.payload.map(row => {
      if (row.id === params.id) {
        return { ...row, admin_price: event.target.value }
      }
      return row
    })
    setJsonData({ ...jsonData, payload: updatedRows })
  }

  const nullToHyphen = value => {
    return value === null ? '-' : value
  }
  // console.log({ page })

  const caculatePrice = async () => {
    const array = [0.1]
    let data = {
      array,
      product_id: jsonData.payload[0].productid
    }
    await axiosInstance
      .post(`${Configuration.baseUrl}/calculate-price`, data)
      .then(res => {
        console.log(res.data.message.result)
        setDerivedPrice(res.data.message.result)
      })
      .catch(error => {
        // console.log(error)
      })
  }


  const updateProductData = () => {
    let data = jsonData.payload
    function updateFields(data, derivedPrice) {
      derivedPrice.forEach(obj2 => {
        let matchingObj = data.find(obj1 => obj1.product_id === obj2.product_id)

        if (matchingObj) {
          // Update the fields in data
          matchingObj.dcx_price = obj2.new_price // Assuming you want to update the price
        }
      })
    }
    updateFields(data, derivedPrice)

    setJsonData(jsonData)
  }

  const derivedPrices = async () => {
    await axiosInstance
      .post(`${Configuration.baseUrl}/calculate-price`)
      .then(res => {
        // updateTablePriceData(res?.data?.message)
        // setDerivedPrice(res.data.message)
        // updateProductData()
      })
      .catch(error => { })
  }




  const updateTablePriceData = () => {
    const derivedPriceList = [
      {
        "product_id": "96a6242a-6828-4e26-955e-354d92945bd3",
        "new_price": 13500,
        "price_type": "Algo",
        "admin_price": 0
      },
      {
        "product_id": "9af6ea5c-36e5-4732-a628-3e3afe6aafec",
        "new_price": 9300,
        "price_type": "Algo",
        "admin_price": 0
      },
      {
        "product_id": "946a0163-b3bb-4bf9-b4c6-0c7e71f51d6e",
        "new_price": 2700,
        "price_type": "Algo",
        "admin_price": 0
      },
      {
        "product_id": "dea54e3a-18fa-4bd9-bf2f-7faf6369fd70",
        "new_price": 7900,
        "price_type": "Algo",
        "admin_price": 0
      },
      {
        "product_id": "0f934e2f-ffa1-480a-a7bd-36ff90675a7d",
        "new_price": 15200,
        "price_type": "Algo",
        "admin_price": 0
      },
      {
        "product_id": "519cb2a3-78be-4247-a96d-fddcdf65481a",
        "new_price": 4500,
        "price_type": "Algo",
        "admin_price": 0
      },
      {
        "product_id": "be2c7656-285b-426d-8f4e-2f217ce7c62e",
        "new_price": 11100,
        "price_type": "Algo",
        "admin_price": 0
      },
      {
        "product_id": "be2c7656-285b-426d-8f4e-2f217ce7c62e",
        "new_price": 11100,
        "price_type": "Algo",
        "admin_price": 0
      },
      {
        "product_id": "be2c7656-285b-426d-8f4e-2f217ce7c62e",
        "new_price": 11100,
        "price_type": "Algo",
        "admin_price": 0
      },
      {
        "product_id": "be2c7656-285b-426d-8f4e-2f217ce7c62e",
        "new_price": 11100,
        "price_type": "Algo",
        "admin_price": 0
      },
      {
        "product_id": "be2c7656-285b-426d-8f4e-2f217ce7c62e",
        "new_price": 11100,
        "price_type": "Algo",
        "admin_price": 0
      }
    ]
    let oldData = jsonData.payload

    for (let i = 0; i < oldData.length; i++) {
      oldData[i].price_type = derivedPriceList[i].price_type
      oldData[i].new_price = derivedPriceList[i].new_price
    }

    setJsonData({
      payload: oldData,
      row_count: jsonData.row_count
    })
  }

  const savePrice = async () => {
    let data = {}
    if (randomPrice == 0) {
      data = {
        product_id: jsonData.payload[0].productid,
        price: derivedPrice
      }
    } else {
      data = {
        product_id: jsonData.payload[0].productid,
        price: randomPrice
      }
    }
    await axiosInstance
      .post(`${Configuration.baseUrl}/save-price`, data)
      .then(res => {
      })
      .catch(error => {
      })
  }
  useEffect(() => {
    if (randomPrice) {
      setIsFormValid(true)
    } else {
      setIsFormValid(false)
    }
  }, [randomPrice])
  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          margin: 3
        }}
      >
        <Grid container sx={{ padding: 1 }}>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant='h6' component='h4' sx={{ color: '#252430' }}>
              Admin Input Price
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Divider sx={{ borderColor: '#252430' }} />
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ padding: 1 }}>
          <Grid item xs={12} sm={4} md={1}>
            <Typography sx={{ color: '#252430', paddingTop: 1.5 }} fullWidth>
              Base Product:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} md={1}>
            <TextField
              id='outlined-basic'
              label='Shape'
              variant='outlined'
              size='small'
              value={baseProduct.shape}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4} md={1}>
            <TextField
              id='outlined-basic'
              label='clarity'
              variant='outlined'
              size='small'
              value={baseProduct.clarity}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4} md={1}>
            <TextField
              id='outlined-basic'
              label='colour'
              variant='outlined'
              size='small'
              value={baseProduct.colour}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4} md={1}>
            <TextField
              id='outlined-basic'
              label='size'
              variant='outlined'
              size='small'
              value={baseProduct.carat}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4} md={1}>
            <TextField
              id='outlined-basic'
              label='Co Relation'
              variant='outlined'
              size='small'
              value={baseProduct.corelation_factor}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4} md={1}>
            <TextField
              id='outlined-basic'
              label='Last Price'
              variant='outlined'
              size='small'
              value={baseProduct.price}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4} md={1}>
            <TextField
              id='outlined-basic'
              label='Admin Price'
              fullWidth
              variant='outlined'
              size='small'
              type='number'
              onChange={e => setRandomPrice(e.target.value)}
            />
          </Grid>
          {matches && (
            <>
              <Grid item xs={12} sm={4} md={1}></Grid>
              <Grid item xs={12} sm={4} md={1}></Grid>
            </>
          )}
          <Grid item xs={12} sm={4} md={1}>
            <Button
              variant='contained'
              fullWidth
              type='submit'
              disabled={!isFormValid}
              onClick={e => caculatePrice()}
              size='medium'
            >
              Calculate
            </Button>
          </Grid>

          <Grid item xs={12} sm={4} md={1}>
            <Button variant='contained' fullWidth type='submit' onClick={e => updateTablePriceData()} size='medium'>
              Derived
            </Button>
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <Divider sx={{ borderColor: '#252430' }} />
          </Grid>
        </Grid>
        <Grid container spacing={1} sx={{ padding: 1 }}>
          {/* <Grid item xs={12} sm={4} md={2}>
            <ToggleButtonGroup
              color='primary'
              value={assetType}
              exclusive
              onChange={handleChangeAsset}
              aria-label='Platform'
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
          <Grid item xs={12} sm={4} md={1}>
            <Box>
              <FormControl fullWidth size='small'>
                <InputLabel id='demo-simple-select-label'>Shape</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={shape}
                  label='Shape'
                  onChange={handleChangeShape}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: '12rem', // Adjust the max height as needed
                        minWidth: '8rem' // Adjust the max height as needed
                      }
                    }
                  }}
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

          <Grid item xs={12} sm={4} md={1}>
            <Box>
              <FormControl fullWidth size='small'>
                <InputLabel id='demo-simple-select-label'>Clarity</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={clarity}
                  label='Clarity'
                  onChange={handleChangeClarity}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: '12rem', // Adjust the max height as needed
                        minWidth: '8rem' // Adjust the max height as needed
                      }
                    }
                  }}
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
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={1}>
            <TextField
              id='outlined-basic'
              label='Carat'
              type='number'
              variant='outlined'
              fullWidth
              size='small'
              inputProps={{ step: 0.01, min: 0.0, max: 10.99 }}
              onChange={e => {
                setCarat(e.target.value)
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={1}>
            <Box>
              <FormControl fullWidth size='small'>
                <InputLabel id='demo-simple-select-label'>Colour</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={colour}
                  label='Colour'
                  onChange={handleChangeColour}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: '12rem', // Adjust the max height as needed
                        minWidth: '8rem' // Adjust the max height as needed
                      }
                    }
                  }}
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
              </FormControl>
            </Box>
          </Grid>

          {matches && (
            <>
              <Grid item xs={12} sm={5} md={1}></Grid>
              <Grid item xs={12} sm={5} md={1}></Grid>
              <Grid item xs={12} sm={5} md={1}></Grid>
              <Grid item xs={12} sm={5} md={1}></Grid>
              <Grid item xs={12} sm={5} md={1}></Grid>
              <Grid item xs={12} sm={5} md={1}></Grid>
              <Grid item xs={12} sm={5} md={1}></Grid>
            </>
          )}
          {/* <Grid item xs={12} sm={4} md={0.8}>
            <Button variant='outlined' fullWidth size='medium'>
              Clear
            </Button>
          </Grid> */}
        </Grid>
        <Grid container spacing={2} sx={{ padding: 1 }}>
          <Grid item md={12} xs={12} sm={12}>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={jsonData.payload.map(row => ({
                  ...row,
                  shape: nullToHyphen(row.shape),
                  clarity: nullToHyphen(row.clarity),
                  colour: nullToHyphen(row.colour),
                  carat: nullToHyphen(row.carat),
                  total_count: nullToHyphen(row.total_count),
                  last_price: nullToHyphen(row.last_price),
                  new_price: nullToHyphen(row.new_price),
                  price_type: nullToHyphen(row.price_type),
                  price_difference: nullToHyphen(row.price_difference),
                  admin_price: nullToHyphen(row.admin_price)
                }))}
                rowCount={jsonData.row_count}
                columns={columns}
                getRowId={row => row.id}
                pageSize={pageSize}
                pagination
                paginationMode='server'
                {...jsonData}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[10, 25, 50, 100]}
                onPageSizeChange={newPageSize => {
                  setPageSize(newPageSize)
                }}
              />
            </Box>
          </Grid>
        </Grid>
        {/* <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={12} sm={4} md={1.5}>
            <Button
              variant='contained'
              fullWidth
              type='submit'
              disabled={!isFormValid}
              onClick={e => caculatePrice()}
              size='medium'
            >
              Calculate
            </Button>
          </Grid>
          <Grid item xs={12} sm={4} md={1.5}>
            <TextField
              id='outlined-basic'
              label='Derived Price'
              value={derivedPrice}
              variant='outlined'
              sx={{ color: '#226bc4 !important' }}
              size='small'
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4} md={1.5}>
            <TextField
              id='outlined-basic'
              label='Admin Price'
              fullWidth
              variant='outlined'
              size='small'
              onChange={e => setRandomPrice(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={1.5}>
            <Button variant='contained' fullWidth size='medium' type='submit' onClick={e => savePrice()}>
              Save
            </Button>
          </Grid>
          <Grid item xs={12} sm={4} md={1.5}>
            <Button variant='outlined' fullWidth size='medium'>
              Clear
            </Button>
          </Grid>
        </Grid> */}
      </Box>
      {isLoading && <Loader />}
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Admincomponents
