// Main layout for gallery page.
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  Grid,
  Button,
  Typography,
  CardActions,
  CardContent,
  Container,
  CssBaseline,
  CardActionArea,
  CardMedia,
  Tooltip,
  Snackbar
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Link as RouterLink } from 'react-router-dom'
import DeleteIcon from '@material-ui/icons/Delete'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRole, deleteGallerySch, fetchGallery} from '../redux/actions/index'
import MuiAlert from '@material-ui/lab/Alert'


const useStyles = makeStyles((theme) => ({
  mainHead: {
    width: '100%',
    backgroundColor: '#404040',
    color: '#fff'
  },
  title: {
    fontSize: 18,
    color: '#80ff80'
  },
  header: {
    padding: theme.spacing(5, 0, 6, 0)
  },
  root: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f4f6f8'
  },
  media: {
    marginTop: theme.spacing(3),
    height: 170
  }
}))

function Alert (props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

// Schematic delete snackbar
function SimpleSnackbar ({ open, close, sch }) {
  const dispatch = useDispatch()

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      open={open}
      autoHideDuration={6000}
      onClose={close}
    >
      <Alert
        icon={false}
        severity="warning"
        color="error"
        style={{ width: '100%' }}
        action={
          <>
            <Button
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => {
                dispatch(deleteGallerySch(sch.save_id))
              }}
            >
              Yes
            </Button>
            <Button
              size="small"
              aria-label="close"
              color="inherit"
              onClick={close}
            >
              NO
            </Button>
          </>
        }
      >
        {'Delete ' + sch.name + ' ?'}
      </Alert>
    </Snackbar>
  )
}


// Card displaying overview of gallery sample schematics.
function SchematicCard ({ sch }) {
  const classes = useStyles()
  const auth = useSelector(state => state.authReducer)
  const dispatch = useDispatch()
  const [snacOpen, setSnacOpen] = React.useState(false)

  const handleSnacClick = () => {
    setSnacOpen(true)
  }
  const handleSnacClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnacOpen(false)
  }  
  useEffect(() => {
    dispatch(fetchRole())
  }, [dispatch])

  return (
    <>
      <Card>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={sch.media}
            title={sch.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {sch.name}
            </Typography>
            <Typography variant="body2" component="p">
              {sch.description}
            </Typography>
          </CardContent>
        </CardActionArea>

        <CardActions>
          <Button
            target="_blank"
            component={RouterLink}
            to={'/editor?id=' + sch.save_id}
            size="small"
            color="primary"
          >
            Launch in Editor
          </Button>
            {console.log(auth.roles)}
           {auth.roles && auth.roles.is_type_staff && 
            <Button>
            <Tooltip title="Delete" placement="bottom" arrow>
              <DeleteIcon
                color="secondary"
                fontSize="small"
                onClick={() => { handleSnacClick() }}
              />
            </Tooltip>            
            </Button>}
            <SimpleSnackbar open={snacOpen} close={handleSnacClose} sch={sch} />
        </CardActions>
      </Card>
    </>
  )
}
SchematicCard.propTypes = {
  sch: PropTypes.object
}

// Card displaying eSim gallery page header.
function MainCard () {
  const classes = useStyles()
  useEffect(() => {
    document.title = 'Gallery - eSim '
  })

  return (
    <Card className={classes.mainHead}>
      <CardContent>
        <Typography variant="h2" align="center" gutterBottom>
        eSim Gallery
        </Typography>
        <Typography className={classes.title} align="center" gutterBottom>
        Sample schematics are listed below...
        </Typography>
      </CardContent>
    </Card>
  )
}

export default function Gallery () {
  const classes = useStyles()
  const GallerySchSample = useSelector(state => state.galleryReducer.schematics)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchGallery())
    dispatch(fetchRole())
  }, [dispatch])
  
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container maxWidth="lg" className={classes.header}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          alignContent="center"
          spacing={3}
        >
          {/* eSim Gallery Header */}
          <Grid item xs={12}>
            <MainCard />
          </Grid>

          {/* Listing Gallery Schematics */}
          {console.log(GallerySchSample)}
          {GallerySchSample.map(
            (sch) => {
                {console.log('kkc', sch)}
              return (
                <Grid item xs={12} sm={6} lg={4} key={sch.save_id}>
                  <SchematicCard sch={sch} />
                </Grid>
              )
            }
          )}

        </Grid>
      </Container>
    </div>
  )
}
