const { BadRequestException } = require("@nestjs/common");
const { AttendanceSnapshotService } = require("./attendanceSnapshot.service");

describe('AttendanceSnapshotService', () => {
  let attendanceSnapshotService;

  beforeEach(() => {
    attendanceSnapshotService = new AttendanceSnapshotService();
    attendanceSnapshotService.prismaService = {
      attendanceSnapshot: {
        findMany: jest.fn().mockResolvedValue([
          
          { id: 1, userId: 1, date: new Date() },
          { id: 2, userId: 1, date: new Date() },
         
        ]),
      },
    };
  });

  it('should return an array of attendance snapshots', async () => {
    const snapshots = await attendanceSnapshotService.getAllAttendanceSnapshots();
    expect(Array.isArray(snapshots)).toBe(true); 
    expect(snapshots.length).toBeGreaterThan(0); 
    
  });

  it('should throw BadRequestException on error', async () => {
    attendanceSnapshotService.prismaService.attendanceSnapshot.findMany.mockRejectedValue(new Error('Database error'));
    
   
    await expect(attendanceSnapshotService.getAllAttendanceSnapshots()).rejects.toThrow(BadRequestException);
  });
});
