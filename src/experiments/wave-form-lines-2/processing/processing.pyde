
options = {
	'color_a': color(255, 255, 0),
	'color_b': color(255, 0, 255),
	'density': 0.015,
	'dissonance': 0.009,
	'emphasis': 50,
	'margin': 0.1,
	'noise_increment': 0.005,
	'points': 0.05,
}

lines = []
line_count = 0
noise_y = random(1000)



class Line:
	def __init__(self, emphasis, points, start, stop):
		self._start = start
		self._stop = stop
		self.emphasis = emphasis
		self.points = points
	def get_length(self):
		return dist(self._start.x, self._start.y, self._stop.x, self._stop.y)

	def get_start(self):
		return self._start.copy()
	def set_start(self, vector):
		self._start = PVector(vector.x, vector.y)
		return self.get_start()
	def get_stop(self):
		return self.stop.copy()
	def set_stop(self, vector):
		self._stop = PVector(vector.x, vector.y)
		return self.get_stop()

	def render(self, noise_y, color):
		global options

		stroke(color)
		beginShape()
		vertex(self._start.x, self._start.y)

		point_distance = self.get_length() / (self.points + 2)
		last_point = self.get_start();

		x = self._start.x + point_distance;
		for n in range(self.points):
			# let emphasisX = 1 - Math.abs(convertRange(x, this._start.x, this._stop.x, -1, 1));
			emphasis_curve = 1 - abs(map(x, self._start.x, self._stop.x, -1, 1))
			# this._start.y + simplex.noise2D(x, this._start.y * settings.dissonance + noiseY) * this.emphasis * emphasisX
			y = self._start.y + noise(x, self._start.y * options.get('dissonance') + noise_y) * self.emphasis * emphasis_curve
			next_point = PVector(x, y)
			# line(last_point.x, last_point.y, next_point.x, next_point.y)
			# control_point = PVector((last_point.x + next_point.x) / 2, (last_point.y + next_point.y) / 2)
			# print(last_point, control_point, next_point)
			# quadraticVertex(control_point.x, control_point.y, last_point.x, last_point.y)
			curveVertex(next_point.x, next_point.y)
			last_point = next_point
			x += point_distance

		control_point = PVector((last_point.x + self._stop.x) / 2, (last_point.y + self._stop.y) / 2)
		quadraticVertex(control_point.x, control_point.y, self._stop.x, self._stop.y)
		endShape()



def create_lines():
	global line_count
	global lines
	global options
	color_start = options.get('color_a')
	color_end = options.get('color_b')
	margin_x = width * options.get('margin')
	margin_y = height * options.get('margin')
	inner_height = height - margin_y * 2
	line_count = round(inner_height * options.get('density'))
	y_gutter = round(inner_height / line_count)
	point_count = floor(dist(margin_x, 0, (width - margin_x), 0)  * options.get('points'))

	y = margin_y + (inner_height - line_count * y_gutter) / 2;
	for l in range(int(line_count)):
		emphasis = options.get('emphasis') * (1 - abs(map(y, margin_y, height - margin_y, -1, 1)))
		lines.append(Line(emphasis, point_count, PVector(margin_x, y), PVector(width - margin_x, y)))
		y += y_gutter



def setup():
	size(1280, 720)
	smooth()
	noFill()
	create_lines()

def draw():
	global lines
	global options
	global noise_y
	background(0)
	line_count = len(lines);

	for index, line in enumerate(lines):
		line.render(noise_y, lerpColor(options.get('color_a'), options.get('color_b'), float(index) / float(line_count)))

	noise_y += options.get('noise_increment')
