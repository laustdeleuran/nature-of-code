import processing.video.*;

// Size of each cell in the grid, ratio of window size to video size
int videoScale = 4;
// Number of columns and rows in the system
int cols, rows;
// Variable to hold onto Capture object
Movie video;

void setup() {  
  size(320, 180);  
  // Initialize columns and rows  
  cols = width/videoScale;  
  rows = height/videoScale;  
  background(0);
  video = new Movie(this, "teal-swan-third-eye.mp4");
  video.play();
}

// Read image from the camera
void captureEvent(Capture video) {  
  video.read();
}

void draw() {
  if (video.available()) {    
    video.read();  
    image(video, 0, 0);
  }
}
