import {
  Box,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  Button,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material'
import createAxiosInstance from 'src/context/createAxiosInstance'
import Configuration from 'src/context/Configuration'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Configurationcomponents = () => {
  const axiosInstance = createAxiosInstance()
  const [assetType, setAssetType] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const getShape = await axiosInstance.get(`${Configuration.baseUrl}/users/get-configuration`)
      if (getShape.data.message[0].percentage_status == true) {
        setAssetType('percentage')
        setAssetTypeValue(getShape.data.message[0].percentage)
      } else {
        setAssetType('count')
      }
      setAssetTypeValueChange('')
    }
    fetchData()
  }, [assetType])

  const matches = useMediaQuery('(min-width:1030px')
  const [age, setAge] = useState('')
  const [assetTypeValue, setAssetTypeValue] = useState(0)
  const [assetTypeValueChange, setAssetTypeValueChange] = useState('')

  const handleChangeAsset = (event, newAlignment) => {
    setAssetType(newAlignment)
  }
  const handleChange = event => {
    setAge(event.target.value)
  }

  const changeCalculationValue = async () => {
    let data = {}
    if (assetType == 'percentage') {
      data = {
        percentage: assetTypeValueChange
      }
    } else {
      data = {
        count: assetTypeValueChange
      }
    }
    await axiosInstance
      .post(`${Configuration.baseUrl}/users/add-configuration`, data)
      .then(res => {
        console.log(res)
        setAssetType('null')
      })
      .catch(err => console.log(err))
  }
  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          margin: 3,
          minHeight: '80vh'
        }}
      >
        <Grid container sx={{ padding: 1 }}>
          <Grid item xs={12} sm={12} md={12}>
            <Typography variant='h6' component='h4' sx={{ color: '#252430' }}>
              Configuration
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <Divider sx={{ borderColor: '#252430' }} />
          </Grid>
        </Grid>
        <Grid container sx={{ padding: 1 }}>
          <Grid item xs={6} sm={3} md={1.2}>
            <Typography variant='h7' component='h4' sx={{ color: '#252430' }} fullwidth>
              Current Active:
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={1.5}>
            <ToggleButtonGroup
              color='primary'
              value={assetType}
              exclusive
              onChange={handleChangeAsset}
              aria-label='Platform'
              fullWidth
              size='small'
            >
              <ToggleButton value='percentage' className='selected-asset'>
                Percentage
              </ToggleButton>
              <ToggleButton value='count' className='selected-asset'>
                Count
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ padding: 1 }}>
          <Grid item xs={6} sm={3} md={1.2}>
            <Typography variant='h7' component='h4' sx={{ color: '#252430' }} fullwidth>
              Change Value:
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={1.6}>
            <TextField
              id='outlined-basic'
              label='Old Value'
              variant='outlined'
              size='small'
              fullwidth
              disabled
              value={assetTypeValue}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={1.5}>
            <TextField
              id='outlined-basic'
              label='Enter New Value'
              variant='outlined'
              size='small'
              fullwidth
              onChange={e => setAssetTypeValueChange(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={1.5}>
            <Button variant='contained' size='medium' type='submit' onClick={e => changeCalculationValue()}>
              Save
            </Button>
          </Grid>
        </Grid>
        {/* <Grid container sx={{ padding: 1 }}>
          <Grid item xs={6} sm={3} md={1.2}>
            <Typography variant='h7' component='h4' sx={{ color: '#252430' }} fullwidth>
              Current Days:
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={1.5}>
            <TextField
              id='outlined-basic'
              label='Current Active Days'
              variant='outlined'
              size='small'
              fullwidth
              disabled
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ padding: 1 }}>
          <Grid item xs={6} sm={3} md={1.2}>
            <Typography variant='h7' component='h4' sx={{ color: '#252430' }} fullwidth>
              Change Days:
            </Typography>
          </Grid>

          <Grid item xs={6} sm={3} md={1.5}>
            <TextField id='outlined-basic' label='Enter Value' variant='outlined' size='small' fullwidth />
          </Grid>
          <Grid item xs={6} sm={3} md={1.6}>
            <Box>
              <FormControl fullWidth size='small'>
                <InputLabel id='demo-simple-select-label'>Calculation Days</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={age}
                  label='Calculation Days'
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Day</MenuItem>
                  <MenuItem value={20}>Month</MenuItem>
                  <MenuItem value={20}>Year</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3} md={1.5}>
            <Button variant='contained' size='medium'>
              Save
            </Button>
          </Grid>
        </Grid> */}
        <Grid container spacing={2} sx={{ padding: 1 }}>
          <Grid item xs={6} sm={3} md={1.2}>
            <Typography variant='h7' component='h4' sx={{ color: '#252430' }} fullwidth>
              Minimum Value:
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} md={1.6}>
            <TextField id='outlined-basic' label='Old Value' variant='outlined' size='small' fullwidth disabled />
          </Grid>
          <Grid item xs={6} sm={3} md={1.5}>
            <TextField id='outlined-basic' label='Enter New Value' variant='outlined' size='small' fullwidth />
          </Grid>
          <Grid item xs={6} sm={3} md={1.5}>
            <Button variant='contained' size='medium'>
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Configurationcomponents
