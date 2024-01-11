import cv2
import numpy as np

def rotate_image(image, angle):
    height, width = image.shape[:2]
    rotation_matrix = cv2.getRotationMatrix2D((width / 2, height / 2), angle, 1)
    rotated_image = cv2.warpAffine(image, rotation_matrix, (width, height))
    return rotated_image

def shift_image(image, dx, dy):
    dx = dx- 200
    # dx, dy = random.randint(-max_shift, max_shift), random.randint(-max_shift, max_shift)
    rows, cols = image.shape[:2]
    translation_matrix = np.float32([[1, 0, dx], [0, 1, dy]])
    shifted_image = cv2.warpAffine(image, translation_matrix, (cols, rows))
    return shifted_image

def zoom_at(img, zoom=1, angle=0, coord=None):
    cy, cx = [ i/2 for i in img.shape[:-1] ] if coord is None else coord[::-1]
    rot_mat = cv2.getRotationMatrix2D((cx,cy), angle, zoom)
    result = cv2.warpAffine(img, rot_mat, img.shape[1::-1], flags=cv2.INTER_LINEAR)
    return result

def adjust_resolution(img, resolution):
    width, height = resolution
    row, col = img.shape[:2]
    bottom = img[row-2:row, 0:col]
    mean = cv2.mean(bottom)[0]
    border = cv2.copyMakeBorder(
        img,
        top = height - col,
        bottom = 0,
        left = 0,
        right = width - row,
        borderType = cv2.BORDER_CONSTANT,
        value=[mean, mean, mean]
    )
    cv2.imwrite('outputs/border.jpeg', border)
    return border

def main():
    image_path = 'example-qr.png'
    fps = 25
    frame_duration = 15
    output_video = '../qr.mp4'
    resolution = (1280, 720)

    original_image = cv2.imread(image_path)

    angles = [0, -5, 12]
    shifts = [15, -20, 5]
    zooms = [0.6, 0.7, 0.8]

    video_writer = cv2.VideoWriter(output_video, cv2.VideoWriter_fourcc(*'mp4v'), fps, resolution)
    # original_image = add_border(original_image)
    for i in range(3):
        out_image = rotate_image(original_image, angles[i])
        out_image = shift_image(out_image, shifts[i], shifts[i])
        out_image = zoom_at(out_image, zooms[i])
        out_image = adjust_resolution(out_image, resolution)
        cv2.imwrite(f'outputs/img{i}.jpeg', out_image)
        for _ in range(frame_duration):
            video_writer.write(out_image)

    video_writer.release()
    print("Video created successfully!")


if __name__ == "__main__":
    main()