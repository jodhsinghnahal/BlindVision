# import time
# from ultralytics import YOLO
# import cv2

# # load yolov8 model
# model = YOLO('yolov8n.pt')

# # load video
# video_path = 'test.mp4'
# cap = cv2.VideoCapture('bus.jpg')

# ret = True
# # read frames
# print(model.track("https://ultralytics.com/images/bus.jpg")[0].boxes.xywh)

# print(results)
# detect objects
# track objects
# results = model.predict('https://ultralytics.com/images/bus.jpg')

# for box in results[0].boxes.xyxy:
#     print(f"Class: {box[3]}, Confidence: {box[3]}, Bounding Box: {box[:3]}")

import time
from ultralytics import YOLO
import cv2
import re

# Load a model
model = YOLO('yolov8n.pt')  # pretrained YOLOv8n model

im = cv2.imread('bus.jpg')

# Run batched inference on a list of images
result = model.predict('bus.jpg')  # return a generator of Results objects

names_ = result[0].names

print(type(im))
# <class 'numpy.ndarray'>
size = im.shape
print(type(im.shape))

x_1 = size[1] / 3
y_1 = size[0] / 3
x_2 = 2*(size[1] / 3)
y_2 = size[0] / 3
x_3 = size[1] / 3
y_3 = 2*(size[0] / 3)
x_4 = 2*(size[1] / 3)
y_4 = 2*(size[0] / 3)

objs = {}
objspos = {}

i= 0
for obj in result[0].boxes.cls:
    ob = str(obj)[7:9]
    if ob[1] == '.':
        ob = ob[0]
    print(names_[int(ob)])
    objs[i] = (names_[int(ob)])
    i += 1

i=0
for obj in result[0].boxes.xyxy:
    print(str(obj))
    ob= str(obj)[8:]
    print(ob)
    ob = ob.split(', ')
    print(ob)            
    numsval = re.sub(r'[^0-9.e+\-]', '', ob[0])
    print(numsval)
    tlx = float(numsval)
    numsval = re.sub(r'[^0-9.e+\-]', '', ob[1])
    print(numsval)
    tly = float(numsval)
    numsval = re.sub(r'[^0-9.e+\-]', '', ob[2])
    print(numsval)
    brx = float(numsval)
    numsval = re.sub(r'[^0-9.e+\-]', '', ob[3])
    print(numsval)
    bry = float(numsval)
    centerx = (tlx+brx)/2
    centery = (tly+bry)/2
    objspos[i] = (centerx, centery)

    if centerx<x_1 and centery<y_1:
        print("top left")
        print(objs[i])
        print(objspos[i])
    elif centerx>x_2 and centery<y_2:
        print("to right")
        print(objs[i])
        print(objspos[i])
    elif centerx<x_3 and centery>y_3:
        print("bottom left")
        print(objs[i])
        print(objspos[i])
    elif centerx > x_4 and centery > y_4:
        print("bottom right")
        print(objs[i])
        print(objspos[i])
    elif centery < y_1:
        print("top")
        print(objs[i])
        print(objspos[i])
    elif centery > y_3:
        print("bottom")
        print(objs[i])
        print(objspos[i])
    elif centerx > x_2:
        print("right")
        print(objs[i])
        print(objspos[i])
    elif centerx < y_1:
        print("left")
        print(objs[i])
        print(objspos[i])
    else:
        print("center")
        print(objs[i])
        print(objspos[i])
    i+=1

# Python program to explain cv2.rectangle() method 
	
# # importing cv2 
# import cv2 
	
# # path 
# path = r'bus.jpg'
	
# # Reading an image in grayscale mode 
# image = cv2.imread(path, 0) 
	
# # Window name in which image is displayed 
# window_name = 'Image'

# # Start coordinate, here (100, 50) 
# # represents the top left corner of rectangle 
# start_point = (0,254) 

# # Ending coordinate, here (125, 80) 
# # represents the bottom right corner of rectangle 
# end_point = (32,325) 

# # Black color in BGR 
# color = (1, 1, 1) 

# # Line thickness of -1 px 
# # Thickness of -1 will fill the entire shape 
# thickness = 10

# # Using cv2.rectangle() method 
# # Draw a rectangle of black color of thickness -1 px 
# image = cv2.rectangle(image, start_point, end_point, color, thickness) 

# # Displaying the image 
# cv2.imshow(window_name, image) 

# cv2.waitKey(0)


# from PIL import Image
# from ultralytics import YOLO

# # Load a pretrained YOLOv8n model
# model = YOLO('yolov8n.pt')

# # Run inference on 'bus.jpg'
# results = model('bus.jpg')  # results list
    

# # Show the results
# for r in results:
#     im_array = r.plot()  # plot a BGR numpy array of predictions
#     im = Image.fromarray(im_array[..., ::-1])  # RGB PIL image
#     im.show()  # show image
#     im.save('results.jpg')  # save image

# model = YOLO('yolov8n.pt')
# results = model.predict('bus.jpg')
# result = results[0]

# for box in result.boxes:
#     class_id = result.names[box.cls[0].item()]
#     cords = box.xyxy[0].tolist()
#     cords = [round(x) for x in cords]
#     conf = round(box.conf[0].item(), 2)
#     print("Object type:", class_id)
#     print("Coordinates:", cords)
#     print("Probability:", conf)
#     print("---")